
(() => {
  const state = {
    workbook: null,
    originalName: "",
    sheetName: "",
    data: [],
    history: [],
    undoStack: [],
    mergeFiles: [],
    smartCleanReport: null,
    reportPreset: "sales",
    reportPreview: null,
    previewSearch: "",
    editingCell: null,
    pivotPreview: null,
    errorScanReport: null,
    chartPreview: null,
    performanceMode: false,
    fileSizeBytes: 0,
    isProcessing: false,
    previewLimit: 30,
    searchLimit: 100,
    authChecked: false,
    currentUser: null
  };

  const $ = id => document.getElementById(id);

  const fileInput = $("mobileExcelFile");
  const sheetSelect = $("mobileSheetSelect");
  const processBtn = $("mobileProcessBtn");
  const undoBtn = $("mobileUndoBtn");
  const downloadBtn = $("mobileDownloadBtn");
  const shareBtn = $("mobileShareBtn");
  const resetBtn = $("mobileResetBtn");
  const message = $("mobileProcessMessage");

  const toolPanels = {
    dedupe: "toolDedupe",
    trim: "toolTrim",
    case: "toolCase",
    pad: "toolPad",
    sort: "toolSort",
    ngrate: "toolNgrate",
    okng: "toolOkng",
    blank: "toolBlank",
    ifbuilder: "toolIfbuilder",
    lookup: "toolLookup",
    split: "toolSplit",
    merge: "toolMerge",
    replace: "toolReplace",
    fillblank: "toolFillblank",
    tonumber: "toolTonumber",
    deletecol: "toolDeletecol",
    mergefiles: "toolMergefiles",
    smartclean: "toolSmartclean",
    autoreport: "toolAutoreport",
    batchcols: "toolBatchcols",
    quickpivot: "toolQuickpivot",
    datetools: "toolDatetools",
    errorcheck: "toolErrorcheck",
    quickchart: "toolQuickchart",
    workflows: "toolWorkflows"
  };

  let activeTool = "dedupe";
  let activeToolCategory = "all";

  function normalizeRows(rows){
    const width = Math.max(0, ...rows.map(r => Array.isArray(r) ? r.length : 0));
    return rows.map(r => {
      const row = Array.isArray(r) ? [...r] : [];
      while(row.length < width) row.push("");
      return row;
    });
  }

  function getHeaders(){
    if(!state.data.length) return [];
    return state.data[0].map((h,i) => String(h ?? "").trim() || `Cột ${i+1}`);
  }

  async function waitForSupabaseClient(timeout=2200){
    const started=Date.now();

    while(Date.now()-started < timeout){
      if(window.avpSupabase){
        return window.avpSupabase;
      }

      /*
        Nếu module auth đã chạy nhưng cấu hình không hợp lệ,
        không cần chờ đủ timeout.
      */
      if(window.AVP_SUPABASE_CONFIGURED === false){
        return null;
      }

      await new Promise(resolve=>setTimeout(resolve,70));
    }

    return window.avpSupabase || null;
  }

  async function getAuthenticatedUser(){
    try{
      const client=await waitForSupabaseClient();

      if(!client){
        state.authChecked=true;
        state.currentUser=null;
        updateProcessLoginState();
        return null;
      }

      const {data,error}=await client.auth.getSession();

      if(error){
        console.warn("Không kiểm tra được session:",error);
        state.authChecked=true;
        state.currentUser=null;
        updateProcessLoginState();
        return null;
      }

      state.authChecked=true;
      state.currentUser=data?.session?.user || null;
      updateProcessLoginState();
      return state.currentUser;
    }catch(e){
      console.warn("Auth gate error:",e);
      state.authChecked=true;
      state.currentUser=null;
      updateProcessLoginState();
      return null;
    }
  }

  function updateProcessLoginState(){
    if(!processBtn) return;

    const loggedIn=Boolean(state.currentUser);
    processBtn.classList.toggle("login-required-state",!loggedIn);

    if(!state.workbook && !state.data.length) return;

    processBtn.title=loggedIn
      ? "Xử lý file Excel"
      : "Cần đăng nhập để xử lý file";
  }

  function showLoginRequired(){
    const modal=$("mobileLoginRequired");
    if(modal){
      modal.hidden=false;
      document.body.classList.add("mobile-login-modal-open");
    }
  }

  function hideLoginRequired(){
    const modal=$("mobileLoginRequired");
    if(modal) modal.hidden=true;
    document.body.classList.remove("mobile-login-modal-open");
  }

  async function ensureLoggedInForProcessing(){
    const user=await getAuthenticatedUser();

    if(user){
      return true;
    }

    showLoginRequired();
    return false;
  }

  const PERF_THRESHOLDS = {
    mediumBytes: 5 * 1024 * 1024,
    largeBytes: 15 * 1024 * 1024,
    mediumRows: 15000,
    largeRows: 50000,
    mediumCells: 180000,
    largeCells: 600000
  };

  function formatBytes(bytes){
    if(!Number.isFinite(bytes) || bytes<=0) return "0 MB";
    return `${(bytes/1024/1024).toFixed(bytes>=10*1024*1024?1:2)} MB`;
  }

  function nextFrame(){
    return new Promise(resolve=>requestAnimationFrame(()=>resolve()));
  }

  function showProcessing(title="Đang xử lý file Excel...", text="Vui lòng giữ trang này mở."){
    state.isProcessing=true;
    const overlay=$("mobileProcessingOverlay");
    if(overlay) overlay.hidden=false;
    const page=document.querySelector(".mobile-excel-page");
    page?.classList.add("is-processing");
    if($("mobileProcessingTitle")) $("mobileProcessingTitle").textContent=title;
    if($("mobileProcessingText")) $("mobileProcessingText").textContent=text;

    processBtn.disabled=true;
    if(fileInput) fileInput.disabled=true;
    if(sheetSelect) sheetSelect.disabled=true;
  }

  function hideProcessing(){
    state.isProcessing=false;
    const overlay=$("mobileProcessingOverlay");
    if(overlay) overlay.hidden=true;
    document.querySelector(".mobile-excel-page")?.classList.remove("is-processing");

    if(state.workbook || state.data.length){
      processBtn.disabled=false;
      if(sheetSelect) sheetSelect.disabled=false;
    }
    if(fileInput) fileInput.disabled=false;
  }

  async function withProcessing(title,text,fn){
    if(state.isProcessing) return;
    showProcessing(title,text);
    await nextFrame();
    try{
      return await fn();
    }finally{
      hideProcessing();
    }
  }

  function evaluatePerformanceMode(){
    const rows=Math.max(0,state.data.length-1);
    const cols=state.data[0]?.length || 0;
    const cells=rows*cols;
    const bytes=state.fileSizeBytes || 0;

    const danger =
      bytes >= PERF_THRESHOLDS.largeBytes ||
      rows >= PERF_THRESHOLDS.largeRows ||
      cells >= PERF_THRESHOLDS.largeCells;

    const performance =
      danger ||
      bytes >= PERF_THRESHOLDS.mediumBytes ||
      rows >= PERF_THRESHOLDS.mediumRows ||
      cells >= PERF_THRESHOLDS.mediumCells;

    state.performanceMode=performance;
    state.previewLimit=danger ? 12 : performance ? 20 : 30;
    state.searchLimit=danger ? 50 : performance ? 75 : 100;

    updatePerformanceBar({rows,cols,cells,bytes,danger,performance});
  }

  function updatePerformanceBar(info){
    const bar=$("mobilePerformanceBar");
    if(!bar) return;

    bar.hidden=!state.data.length;
    bar.classList.toggle("performance-mode",info.performance && !info.danger);
    bar.classList.toggle("danger-mode",info.danger);

    $("perfRows").textContent=`${new Intl.NumberFormat("vi-VN").format(info.rows)} dòng`;
    $("perfCols").textContent=`${info.cols} cột`;
    $("perfSize").textContent=formatBytes(info.bytes);

    const mode=$("perfMode");
    const msg=$("perfMessage");

    if(info.danger){
      mode.textContent="Large File";
      msg.textContent="File rất lớn: preview và Undo đã được giảm mạnh để hạn chế treo trình duyệt. Nên xử lý từng Sheet và tránh mở nhiều tab.";
    }else if(info.performance){
      mode.textContent="Performance";
      msg.textContent="Performance Mode đang bật: preview, tìm kiếm và Undo được tối ưu để giảm RAM trên điện thoại.";
    }else{
      mode.textContent="Normal";
      msg.textContent="File đang ở chế độ xử lý tiêu chuẩn.";
    }
  }

  function getUndoLimit(){
    if(!state.performanceMode) return 10;

    const rows=Math.max(0,state.data.length-1);
    const cells=rows*(state.data[0]?.length || 0);

    if(
      state.fileSizeBytes >= PERF_THRESHOLDS.largeBytes ||
      cells >= PERF_THRESHOLDS.largeCells
    ) return 1;

    return 3;
  }

  function loadSheet(name){
    if(!state.workbook || !name) return;
    const ws = state.workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:"", raw:true });
    state.sheetName = name;
    state.data = normalizeRows(rows);

    if(!state.data.length){
      state.data=[["(Sheet trống)"]];
    }
    state.previewSearch = "";
    const dataSearch = $("mobileDataSearch");
    if(dataSearch) dataSearch.value = "";
    $("mobileDataSearchClear")?.classList.remove("show");
    state.smartCleanReport = null;
    state.reportPreview = null;
    const reportPreview = $("mobileReportPreview");
    if(reportPreview) reportPreview.hidden = true;
    const smartReport = $("smartCleanReport");
    if(smartReport) smartReport.hidden = true;
    const errReport = $("errorScanReport");
    if(errReport) errReport.hidden = true;
    const chartPreview = $("mobileChartPreview");
    if(chartPreview) chartPreview.hidden = true;
    renderPreview();
    populateColumns();
    populateLookupSheets();
    renderBatchColumns();
    populatePivotSecondGroup();
    renderWorkflowColumns();
    renderWorkflowSavedList();
    evaluatePerformanceMode();
  }

  function getSheetRows(sheetName){
    if(!state.workbook || !sheetName) return [];
    const ws = state.workbook.Sheets[sheetName];
    return normalizeRows(XLSX.utils.sheet_to_json(ws,{header:1,defval:"",raw:true}));
  }

  function populateLookupSheets(){
    const lookupSheet = $("lookupSheet");
    if(!lookupSheet || !state.workbook) return;

    const old = lookupSheet.value;
    lookupSheet.innerHTML = state.workbook.SheetNames.map(name =>
      `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`
    ).join("");

    if(state.workbook.SheetNames.includes(old)){
      lookupSheet.value = old;
    }else if(state.workbook.SheetNames.length > 1){
      const other = state.workbook.SheetNames.find(n => n !== state.sheetName);
      if(other) lookupSheet.value = other;
    }

    populateLookupColumns();
  }

  function populateLookupColumns(){
    const sheetName = $("lookupSheet")?.value;
    const rows = getSheetRows(sheetName);
    const headers = rows[0] || [];

    ["lookupKeyColumn","lookupReturnColumn"].forEach(id=>{
      const select=$(id);
      if(!select) return;
      const old=select.value;
      select.innerHTML=headers.map((h,i)=>
        `<option value="${i}">${escapeHtml(String(h || `Cột ${i+1}`))}</option>`
      ).join("");
      if([...select.options].some(o=>o.value===old)) select.value=old;
    });

    if($("lookupReturnColumn") && headers.length > 1 && !$("lookupReturnColumn").value){
      $("lookupReturnColumn").value="1";
    }
  }

  function populateColumns(){
    const headers = getHeaders();
    document.querySelectorAll(".mobile-column-select").forEach(select => {
      const old = select.value;
      select.innerHTML = headers.map((h,i) =>
        `<option value="${i}">${escapeHtml(h)} — cột ${columnLetter(i)}</option>`
      ).join("");
      if([...select.options].some(o => o.value === old)) select.value = old;
    });

    autoPick("ngInputColumn", /(^|\b)input(\b| qty)/i);
    autoPick("ngQtyColumn", /\bng\b|ng qty|defect qty/i);
  }

  function autoPick(id, regex){
    const select = $(id);
    if(!select) return;
    const headers = getHeaders();
    const index = headers.findIndex(h => regex.test(h));
    if(index >= 0) select.value = String(index);
  }

  function columnLetter(index){
    let n=index+1, out="";
    while(n){
      n--;
      out=String.fromCharCode(65+n%26)+out;
      n=Math.floor(n/26);
    }
    return out;
  }

  function escapeHtml(value){
    return String(value ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;");
  }

  function displayValue(value){
    if(value instanceof Date) return value.toLocaleDateString("vi-VN");
    if(typeof value === "number") return String(value);
    return String(value ?? "");
  }

  function rowMatchesSearch(row, query){
    if(!query) return true;
    const q=normalizeSearchText(query);
    return row.some(v=>normalizeSearchText(displayValue(v)).includes(q));
  }

  function renderPreview(){
    const empty = $("mobilePreviewEmpty");
    const scroll = $("mobilePreviewScroll");
    const table = $("mobilePreviewTable");

    if(!state.data.length){
      empty.hidden=false;
      scroll.hidden=true;
      table.innerHTML="";
      const info=$("mobileDataSearchInfo");
      if(info) info.textContent="";
      return;
    }

    empty.hidden=true;
    scroll.hidden=false;

    const header = state.data[0] || [];
    const allRows = state.data.slice(1);
    const query=(state.previewSearch || "").trim();

    let indexedRows = allRows.map((row,i)=>({row,dataIndex:i+1}));

    if(query){
      indexedRows=indexedRows.filter(item=>rowMatchesSearch(item.row,query));
    }

    const shown=indexedRows.slice(0,query ? state.searchLimit : state.previewLimit);

    const info=$("mobileDataSearchInfo");
    if(info){
      if(query){
        info.textContent=
          indexedRows.length
            ? `Tìm thấy ${indexedRows.length} dòng phù hợp${indexedRows.length>state.searchLimit?` · đang hiển thị ${state.searchLimit} dòng đầu`:""}.`
            : "Không tìm thấy dữ liệu phù hợp.";
      }else{
        info.textContent=
          `Đang hiển thị ${Math.min(state.previewLimit,allRows.length)}/${allRows.length} dòng${state.performanceMode?" · Performance Mode":""}. Chạm vào ô để chỉnh sửa.`;
      }
    }

    const headHtml=
      `<thead><tr>${
        header.map(v=>
          `<th title="${escapeHtml(displayValue(v))}">${escapeHtml(displayValue(v))}</th>`
        ).join("")
      }</tr></thead>`;

    const bodyHtml=shown.map(item=>{
      const row=item.row;
      return `<tr data-row-index="${item.dataIndex}">${
        row.map((v,colIndex)=>{
          const text=displayValue(v);
          const hit=query && normalizeSearchText(text).includes(normalizeSearchText(query));
          return `<td
            class="mobile-editable-cell${hit?" mobile-search-hit":""}"
            data-row-index="${item.dataIndex}"
            data-col-index="${colIndex}"
            title="${escapeHtml(text)}"
          >${escapeHtml(text)}</td>`;
        }).join("")
      }</tr>`;
    }).join("");

    table.innerHTML=headHtml+`<tbody>${bodyHtml}</tbody>`;
  }

  function parseEditedValue(raw, oldValue){
    const text=String(raw ?? "");

    /*
      Giữ chuỗi nếu ô cũ là chuỗi.
      Nếu ô cũ là số, cho phép nhập số mới.
    */
    if(typeof oldValue === "number"){
      const normalized=text.trim().replace(",",".");
      const n=Number(normalized);
      if(Number.isFinite(n)) return n;
    }

    return text;
  }

  function openCellEditor(rowIndex,colIndex){
    if(!state.data[rowIndex]) return;

    const header=getHeaders();
    const oldValue=state.data[rowIndex][colIndex] ?? "";

    state.editingCell={
      rowIndex,
      colIndex,
      oldValue
    };

    const meta=$("mobileCellEditorMeta");
    if(meta){
      meta.textContent=
        `Dòng ${rowIndex+1} · ${header[colIndex] || columnLetter(colIndex)} · Cột ${columnLetter(colIndex)}`;
    }

    const input=$("mobileCellEditorInput");
    if(input){
      input.value=displayValue(oldValue);
    }

    const editor=$("mobileCellEditor");
    if(editor){
      editor.hidden=false;
      document.body.classList.add("mobile-editor-open");
      setTimeout(()=>input?.focus(),60);
    }
  }

  function closeCellEditor(){
    const editor=$("mobileCellEditor");
    if(editor) editor.hidden=true;
    document.body.classList.remove("mobile-editor-open");
    state.editingCell=null;
  }

  function saveCellEdit(){
    const edit=state.editingCell;
    if(!edit || !state.data[edit.rowIndex]) return;

    pushUndoSnapshot();

    const input=$("mobileCellEditorInput");
    const newValue=parseEditedValue(input?.value ?? "",edit.oldValue);

    state.data[edit.rowIndex][edit.colIndex]=newValue;
    updateWorkbookSheet();
    renderPreview();

    const header=getHeaders();
    addHistory(
      `Sửa ô ${columnLetter(edit.colIndex)}${edit.rowIndex+1} (${header[edit.colIndex] || "Cột"}).`
    );

    downloadBtn.disabled=false;
    shareBtn.disabled=false;
    success("Đã cập nhật ô dữ liệu.");
    closeCellEditor();
  }

  function deleteEditingRow(){
    const edit=state.editingCell;
    if(!edit || edit.rowIndex<=0 || !state.data[edit.rowIndex]) return;

    const ok=window.confirm(`Xóa dòng ${edit.rowIndex+1} khỏi Sheet "${state.sheetName}"?`);
    if(!ok) return;

    pushUndoSnapshot();
    state.data.splice(edit.rowIndex,1);
    updateWorkbookSheet();
    renderPreview();

    addHistory(`Xóa dòng ${edit.rowIndex+1} bằng trình chỉnh sửa.`);
    downloadBtn.disabled=false;
    shareBtn.disabled=false;
    success("Đã xóa dòng.");
    closeCellEditor();
  }

  function updateWorkbookSheet(){
    if(!state.workbook || !state.sheetName) return;
    state.workbook.Sheets[state.sheetName] = XLSX.utils.aoa_to_sheet(state.data);
  }

  function addHistory(text){
    state.history.unshift({
      text,
      time:new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})
    });

    /* Tránh history tăng vô hạn trong phiên xử lý dài */
    if(state.history.length > 50){
      state.history.length=50;
    }

    renderHistory();
  }

  function renderHistory(){
    const root=$("mobileHistory");
    if(!state.history.length){
      root.innerHTML='<p class="mobile-muted">Chưa có thao tác nào.</p>';
      return;
    }
    root.innerHTML=state.history.map(x =>
      `<div class="mobile-history-item"><strong>${x.time}</strong> · ${escapeHtml(x.text)}</div>`
    ).join("");
  }

  function success(text){
    message.textContent="✓ "+text;
    message.style.color="#217346";
  }

  function error(text){
    message.textContent="⚠ "+text;
    message.style.color="#b14039";
  }

  function isBlank(v){
    return v === "" || v === null || v === undefined || String(v).trim() === "";
  }

  function smartCompare(a,b){
    const na = typeof a === "number" ? a : Number(String(a).replace(",","."));
    const nb = typeof b === "number" ? b : Number(String(b).replace(",","."));
    if(!Number.isNaN(na) && !Number.isNaN(nb)) return na-nb;
    return String(a ?? "").localeCompare(String(b ?? ""),"vi",{numeric:true,sensitivity:"base"});
  }

  function properCase(v){
    return String(v ?? "")
      .toLocaleLowerCase("vi-VN")
      .replace(/(^|[\s\-_/])([\p{L}])/gu, (_,sep,ch) => sep + ch.toLocaleUpperCase("vi-VN"));
  }

  function cloneData(data){
    return data.map(row => row.map(value => value instanceof Date ? new Date(value) : value));
  }

  function pushUndoSnapshot(){
    const limit=getUndoLimit();

    /*
      Với file rất lớn, chỉ giữ 1 snapshot. Đây là điểm quan trọng
      để tránh nhân đôi hàng trăm nghìn cell trong RAM mobile.
    */
    state.undoStack.push({
      sheetName: state.sheetName,
      data: cloneData(state.data)
    });

    while(state.undoStack.length > limit){
      state.undoStack.shift();
    }

    if(undoBtn) undoBtn.disabled = state.undoStack.length === 0;
  }

  function undoLastAction(){
    const snapshot = state.undoStack.pop();

    if(!snapshot){
      error("Chưa có thao tác nào để hoàn tác.");
      return;
    }

    if(snapshot.sheetName !== state.sheetName){
      state.sheetName = snapshot.sheetName;
      if(sheetSelect) sheetSelect.value = snapshot.sheetName;
    }

    state.data = cloneData(snapshot.data);
    updateWorkbookSheet();
    renderPreview();
    populateColumns();
    populateLookupSheets();
    renderBatchColumns();
    populatePivotSecondGroup();
    renderWorkflowColumns();

    if(undoBtn) undoBtn.disabled = state.undoStack.length === 0;
    addHistory("Hoàn tác thao tác gần nhất.");
    success("Đã hoàn tác.");
  }

  function populatePivotSecondGroup(){
    const select=$("pivotSecondGroupColumn");
    if(!select) return;

    const headers=getHeaders();
    const old=select.value;

    select.innerHTML=
      `<option value="-1">— Không dùng —</option>`+
      headers.map((h,i)=>
        `<option value="${i}">${escapeHtml(h)} — cột ${columnLetter(i)}</option>`
      ).join("");

    if([...select.options].some(o=>o.value===old)){
      select.value=old;
    }else{
      select.value="-1";
    }
  }

  function aggregateValues(values, mode){
    if(mode==="count"){
      return values.length;
    }

    const nums=values.map(Number).filter(Number.isFinite);
    if(!nums.length) return 0;

    if(mode==="sum") return nums.reduce((a,b)=>a+b,0);
    if(mode==="avg") return nums.reduce((a,b)=>a+b,0)/nums.length;
    if(mode==="min") return Math.min(...nums);
    if(mode==="max") return Math.max(...nums);

    return 0;
  }

  function buildQuickPivot(){
    if(!state.data.length) throw new Error("No data");

    const rows=state.data.slice(1).filter(row=>row.some(v=>!isBlank(v)));
    const headers=getHeaders();

    const groupCol=Number($("pivotGroupColumn")?.value ?? -1);
    const secondCol=Number($("pivotSecondGroupColumn")?.value ?? -1);
    const valueCol=Number($("pivotValueColumn")?.value ?? -1);
    const aggregation=$("pivotAggregation")?.value || "sum";
    const sortMode=$("pivotSort")?.value || "desc";
    const topN=Math.max(5,Math.min(100,Number($("pivotTopN")?.value)||20));

    if(groupCol<0 || valueCol<0){
      throw new Error("Missing columns");
    }

    if(secondCol===groupCol){
      throw new Error("Same group columns");
    }

    const map=new Map();

    rows.forEach(row=>{
      const group=String(row[groupCol] ?? "").trim() || "(Trống)";
      const second=secondCol>=0
        ? (String(row[secondCol] ?? "").trim() || "(Trống)")
        : "";

      const key=secondCol>=0 ? `${group}\u0001${second}` : group;

      if(!map.has(key)){
        map.set(key,{
          group,
          second,
          values:[],
          count:0
        });
      }

      const item=map.get(key);
      item.count++;

      if(aggregation==="count"){
        item.values.push(1);
      }else{
        item.values.push(row[valueCol]);
      }
    });

    let items=[...map.values()].map(item=>({
      ...item,
      result:aggregateValues(item.values,aggregation)
    }));

    if(sortMode==="name"){
      items.sort((a,b)=>
        `${a.group} ${a.second}`.localeCompare(`${b.group} ${b.second}`,"vi",{numeric:true,sensitivity:"base"})
      );
    }else{
      items.sort((a,b)=>
        sortMode==="asc"
          ? a.result-b.result
          : b.result-a.result
      );
    }

    const fullItems=[...items];
    items=items.slice(0,topN);

    const totalResult=
      aggregation==="avg"
        ? aggregateValues(
            rows.map(r=>r[valueCol]),
            "avg"
          )
        : aggregation==="count"
          ? rows.length
          : aggregation==="min"
            ? aggregateValues(rows.map(r=>r[valueCol]),"min")
            : aggregation==="max"
              ? aggregateValues(rows.map(r=>r[valueCol]),"max")
              : aggregateValues(rows.map(r=>r[valueCol]),"sum");

    const aggregationLabel={
      sum:"SUM",
      count:"COUNT",
      avg:"AVERAGE",
      min:"MIN",
      max:"MAX"
    }[aggregation] || aggregation.toUpperCase();

    return {
      rows,
      headers,
      groupCol,
      secondCol,
      valueCol,
      aggregation,
      aggregationLabel,
      items,
      fullItems,
      totalResult,
      topN
    };
  }

  function renderQuickPivotPreview(pivot){
    const root=$("mobilePivotPreview");
    if(!root) return;

    root.hidden=false;

    const groupName=pivot.headers[pivot.groupCol] || "Nhóm";
    const secondName=pivot.secondCol>=0
      ? (pivot.headers[pivot.secondCol] || "Nhóm phụ")
      : null;
    const valueName=pivot.headers[pivot.valueCol] || "Giá trị";

    $("pivotPreviewTitle").textContent=
      `${pivot.aggregationLabel} ${valueName} theo ${groupName}`;
    $("pivotPreviewCount").textContent=`${pivot.fullItems.length} nhóm`;

    $("mobilePivotKpis").innerHTML=[
      ["Số dòng",pivot.rows.length],
      ["Số nhóm",pivot.fullItems.length],
      [pivot.aggregationLabel,formatReportNumber(pivot.totalResult)]
    ].map(([label,value])=>
      `<div class="mobile-pivot-kpi"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`
    ).join("");

    $("pivotPreviewHead").innerHTML=
      `<tr>
        <th>${escapeHtml(groupName)}</th>
        ${secondName ? `<th>${escapeHtml(secondName)}</th>` : ""}
        <th>${escapeHtml(pivot.aggregationLabel+" "+valueName)}</th>
      </tr>`;

    $("pivotPreviewBody").innerHTML=
      pivot.items.map(item=>
        `<tr>
          <td>${escapeHtml(item.group)}</td>
          ${secondName ? `<td>${escapeHtml(item.second)}</td>` : ""}
          <td>${escapeHtml(formatReportNumber(item.result))}</td>
        </tr>`
      ).join("");
  }

  function createQuickPivotSheet(){
    const pivot=buildQuickPivot();
    state.pivotPreview=pivot;
    renderQuickPivotPreview(pivot);

    const groupName=pivot.headers[pivot.groupCol] || "Group";
    const secondName=pivot.secondCol>=0
      ? (pivot.headers[pivot.secondCol] || "Second Group")
      : null;
    const valueName=pivot.headers[pivot.valueCol] || "Value";

    const sheetName=($("pivotSheetName")?.value.trim() || "Quick Pivot").slice(0,31);

    const aoa=[];
    aoa.push(["QUICK PIVOT / SUMMARY"]);
    aoa.push(["Nguồn dữ liệu",state.sheetName]);
    aoa.push(["Phép tính",pivot.aggregationLabel]);
    aoa.push([]);

    const tableHeader=[groupName];
    if(secondName) tableHeader.push(secondName);
    tableHeader.push(`${pivot.aggregationLabel} ${valueName}`);
    tableHeader.push("Số dòng");
    aoa.push(tableHeader);

    pivot.fullItems.forEach(item=>{
      const row=[item.group];
      if(secondName) row.push(item.second);
      row.push(item.result);
      row.push(item.count);
      aoa.push(row);
    });

    const ws=XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"]=[
      {wch:28},
      {wch:24},
      {wch:18},
      {wch:12}
    ];

    if(state.workbook.Sheets[sheetName]){
      delete state.workbook.Sheets[sheetName];
      state.workbook.SheetNames=state.workbook.SheetNames.filter(n=>n!==sheetName);
    }

    XLSX.utils.book_append_sheet(state.workbook,ws,sheetName);

    addHistory(
      `Tạo Quick Pivot: ${pivot.aggregationLabel} ${valueName} theo ${groupName}${secondName ? " + "+secondName : ""}.`
    );

    downloadBtn.disabled=false;
    shareBtn.disabled=false;

    success(`Đã tạo Sheet "${sheetName}".`);
  }


  const EXCEL_ERROR_STRINGS = ["#N/A","#VALUE!","#DIV/0!","#REF!","#NAME?","#NUM!","#NULL!","#SPILL!","#CALC!"];

  function parseFlexibleDate(value){
    if(value instanceof Date && !isNaN(value)) return value;

    if(typeof value === "number" && typeof XLSX !== "undefined" && XLSX.SSF?.parse_date_code){
      const d = XLSX.SSF.parse_date_code(value);
      if(d) return new Date(d.y, d.m - 1, d.d);
    }

    const raw = String(value ?? "").trim();
    if(!raw) return null;

    const m1 = raw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
    if(m1){
      const [,dd,mm,yyyy] = m1;
      const dt = new Date(Number(yyyy), Number(mm)-1, Number(dd));
      if(!isNaN(dt)) return dt;
    }

    const m2 = raw.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);
    if(m2){
      const [,yyyy,mm,dd] = m2;
      const dt = new Date(Number(yyyy), Number(mm)-1, Number(dd));
      if(!isNaN(dt)) return dt;
    }

    const dt = new Date(raw);
    if(!isNaN(dt)) return dt;
    return null;
  }

  function formatDateOutput(date, mode){
    if(!(date instanceof Date) || isNaN(date)) return "";
    const dd = String(date.getDate()).padStart(2,"0");
    const mm = String(date.getMonth()+1).padStart(2,"0");
    const yyyy = date.getFullYear();
    return mode === "yyyymmdd" ? `${yyyy}-${mm}-${dd}` : `${dd}/${mm}/${yyyy}`;
  }

  function applyDateTools(){
    const mode = $("dateToolMode")?.value || "format";
    const fmt = $("dateOutputFormat")?.value || "ddmmyyyy";
    const primary = Number($("datePrimaryColumn")?.value ?? -1);
    const secondary = Number($("dateSecondaryColumn")?.value ?? -1);
    const outputName = ($("dateOutputName")?.value || "Date Result").trim() || "Date Result";
    if(primary < 0) throw new Error("No date column");

    let header = [...state.data[0]];
    let rows = state.data.slice(1).map(r=>[...r]);
    let changed = 0;

    if(mode === "format"){
      rows.forEach(row=>{
        const dt = parseFlexibleDate(row[primary]);
        if(dt){
          const next = formatDateOutput(dt, fmt);
          if(String(row[primary] ?? "") !== next){
            row[primary] = next;
            changed++;
          }
        }
      });
      state.data = normalizeRows([header, ...rows]);
      addHistory(`Chuẩn hóa ngày cho cột ${getHeaders()[primary]} (${changed} ô).`);
      return;
    }

    if(mode === "split"){
      header.push(`${outputName} Day`, `${outputName} Month`, `${outputName} Year`);
      rows.forEach(row=>{
        const dt = parseFlexibleDate(row[primary]);
        row.push(dt ? dt.getDate() : "", dt ? dt.getMonth()+1 : "", dt ? dt.getFullYear() : "");
        if(dt) changed++;
      });
      state.data = normalizeRows([header, ...rows]);
      addHistory(`Tách Day/Month/Year từ cột ${getHeaders()[primary]} (${changed} dòng).`);
      return;
    }

    if(mode === "diff"){
      if(secondary < 0) throw new Error("Need second date");
      header.push(outputName || "Date Diff");
      rows.forEach(row=>{
        const d1 = parseFlexibleDate(row[primary]);
        const d2 = parseFlexibleDate(row[secondary]);
        if(d1 && d2){
          const diff = Math.round((d2 - d1) / 86400000);
          row.push(diff);
          changed++;
        }else{
          row.push("");
        }
      });
      state.data = normalizeRows([header, ...rows]);
      addHistory(`Tính chênh lệch ngày từ ${getHeaders()[primary]} → ${getHeaders()[secondary]} (${changed} dòng).`);
    }
  }

  function scanErrorIssues(){
    if(!state.data.length){ error("Hãy upload file trước khi quét."); return; }
    const rows = state.data.slice(1);
    let formulaErrors = 0, blanks = 0, textErrors = 0;
    rows.forEach(row=>{
      row.forEach(v=>{
        const text = String(v ?? "").trim();
        if(!text){ blanks++; return; }
        if(EXCEL_ERROR_STRINGS.includes(text.toUpperCase())) formulaErrors++;
        if(/^(nan|undefined|null)$/i.test(text)) textErrors++;
      });
    });
    const report = { formulaErrors, blanks, textErrors };
    state.errorScanReport = report;
    const total = formulaErrors + blanks + textErrors;
    $("errorScanReport").hidden = false;
    $("errorIssueCount").textContent = `${total} vấn đề`;
    $("errorFormulaCount").textContent = `${formulaErrors} ô`;
    $("errorBlankCount").textContent = `${blanks} ô`;
    $("errorTextCount").textContent = `${textErrors} ô`;
    success(total ? `Đã phát hiện ${total} vấn đề dữ liệu.` : "Không phát hiện lỗi dữ liệu phổ biến.");
  }

  function applyErrorIssues(){
    if(!state.data.length) throw new Error("No data");
    if(!state.errorScanReport) scanErrorIssues();
    const replaceValue = $("errorReplaceValue")?.value ?? "";
    const fixFormula = $("errorFixFormulaErrors")?.checked;
    const fixBlank = $("errorFixBlanks")?.checked;
    const fixText = $("errorFixTextErrors")?.checked;
    let header = [...state.data[0]];
    let rows = state.data.slice(1).map(r=>[...r]);
    let changed = 0;
    rows.forEach(row=>{
      row.forEach((v,i)=>{
        const text = String(v ?? "").trim();
        if(fixBlank && !text){ row[i] = replaceValue; changed++; return; }
        if(fixFormula && EXCEL_ERROR_STRINGS.includes(text.toUpperCase())){ row[i] = replaceValue; changed++; return; }
        if(fixText && /^(nan|undefined|null)$/i.test(text)){ row[i] = replaceValue; changed++; }
      });
    });
    state.data = normalizeRows([header, ...rows]);
    addHistory(`Xử lý lỗi dữ liệu (${changed} ô thay đổi).`);
    state.errorScanReport = null;
    const root=$("errorScanReport"); if(root) root.hidden = true;
  }

  function buildQuickChartData(){
    if(!state.data.length) throw new Error("No data");
    const rows = state.data.slice(1).filter(row=>row.some(v=>!isBlank(v)));
    const headers = getHeaders();
    const type = $("chartType")?.value || "column";
    const labelCol = Number($("chartLabelColumn")?.value ?? -1);
    const valueCol = Number($("chartValueColumn")?.value ?? -1);
    const topN = Math.max(3, Math.min(50, Number($("chartTopN")?.value)||10));
    if(labelCol < 0 || valueCol < 0) throw new Error("No chart columns");
    const map = new Map();
    rows.forEach(row=>{
      const label = String(row[labelCol] ?? "").trim() || "(Trống)";
      const val = Number(row[valueCol]);
      if(!map.has(label)) map.set(label, 0);
      map.set(label, map.get(label) + (Number.isFinite(val) ? val : 0));
    });
    let items = [...map.entries()].map(([label,value])=>({label, value})).sort((a,b)=>b.value-a.value).slice(0, topN);
    const total = items.reduce((s,x)=>s+x.value,0) || 1;
    let cum = 0;
    items = items.map(item=>{
      const share = item.value / total;
      cum += share;
      return { ...item, share, cumulative: cum };
    });
    return { type, labelHeader: headers[labelCol], valueHeader: headers[valueCol], items, total };
  }

  function renderQuickChartPreview(chart){
    const root = $("mobileChartPreview"); if(!root) return;
    root.hidden = false;
    $("chartPreviewTitle").textContent = `${chart.type.toUpperCase()} · ${chart.valueHeader} theo ${chart.labelHeader}`;
    $("chartPreviewMeta").textContent = `${chart.items.length} mục`;
    const max = Math.max(1, ...chart.items.map(x=>x.type==='pareto'?x.cumulative*100:x.value));
    const cls = chart.type;
    $("mobileChartBars").innerHTML = chart.items.map(item=>{
      const metric = chart.type === 'pareto' ? item.cumulative * 100 : item.value;
      const pct = Math.max(2, (metric / max) * 100);
      const meta = chart.type === 'pie'
        ? `${(item.share*100).toFixed(1)}%`
        : chart.type === 'pareto'
          ? `${formatReportNumber(item.value)} · ${(item.cumulative*100).toFixed(1)}%`
          : formatReportNumber(item.value);
      return `<div class="mobile-chart-bar-row"><span class="mobile-chart-bar-label" title="${escapeHtml(item.label)}">${escapeHtml(item.label)}</span><span class="mobile-chart-bar-track"><span class="mobile-chart-bar-fill ${cls}" style="width:${pct}%"></span></span><span class="mobile-chart-bar-value">${escapeHtml(meta)}</span></div>`;
    }).join("");
  }

  function createQuickChartSheet(){
    const chart = buildQuickChartData();
    state.chartPreview = chart;
    renderQuickChartPreview(chart);
    const sheetName = ($("chartSheetName")?.value.trim() || "Quick Chart").slice(0,31);
    const aoa = [["QUICK CHART DATA"],["Loại", chart.type],["Nguồn", state.sheetName],[]];
    if(chart.type === 'pareto'){
      aoa.push([chart.labelHeader || "Label", chart.valueHeader || "Value", "Share %", "Cumulative %"]);
      chart.items.forEach(item=>aoa.push([item.label, item.value, item.share, item.cumulative]));
    }else{
      aoa.push([chart.labelHeader || "Label", chart.valueHeader || "Value", "Share %"]);
      chart.items.forEach(item=>aoa.push([item.label, item.value, item.share]));
    }
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [{wch:28},{wch:18},{wch:14},{wch:14}];
    if(state.workbook.Sheets[sheetName]){
      delete state.workbook.Sheets[sheetName];
      state.workbook.SheetNames = state.workbook.SheetNames.filter(n=>n!==sheetName);
    }
    XLSX.utils.book_append_sheet(state.workbook, ws, sheetName);
    addHistory(`Tạo dữ liệu biểu đồ ${chart.type} trong Sheet "${sheetName}".`);
    downloadBtn.disabled = false; shareBtn.disabled = false;
    success(`Đã tạo Sheet "${sheetName}".`);
  }

  const WORKFLOW_STORAGE_KEY = "avp_excel_mobile_workflows_v1";
  function getWorkflowSelectedColumns(){
    return [...document.querySelectorAll('.workflow-column-checkbox:checked')].map(el=>Number(el.value)).filter(Number.isInteger);
  }

  function updateWorkflowCount(){
    const root=$("workflowColumnsList");
    return getWorkflowSelectedColumns().length;
  }

  function renderWorkflowColumns(selected=[]){
    const root = $("workflowColumnsList");
    if(!root) return;
    const headers = getHeaders();
    if(!headers.length){ root.innerHTML = '<p class="mobile-muted">Upload file để chọn cột.</p>'; return; }
    root.innerHTML = headers.map((h,i)=>`
      <label class="batch-column-item">
        <input class="workflow-column-checkbox" type="checkbox" value="${i}" ${selected.includes(i)?'checked':''}>
        <span><strong title="${escapeHtml(h)}">${escapeHtml(h)}</strong><small>Cột ${columnLetter(i)}</small></span>
      </label>
    `).join('');
  }

  function loadSavedWorkflows(){
    try{ return JSON.parse(localStorage.getItem(WORKFLOW_STORAGE_KEY) || '[]'); }catch(e){ return []; }
  }

  function saveSavedWorkflows(items){
    localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(items));
  }

  function renderWorkflowSavedList(selectedName=""){
    const items = loadSavedWorkflows();
    const select = $("workflowSavedList");
    if(!select) return;
    select.innerHTML = `<option value="">${items.length ? '— Chọn workflow đã lưu —' : '— Chưa có workflow —'}</option>` + items.map(item=>`<option value="${escapeHtml(item.name)}">${escapeHtml(item.name)}</option>`).join('');
    if(selectedName && items.some(x=>x.name===selectedName)) select.value = selectedName;
  }

  function collectWorkflowConfig(){
    return {
      name: ($("workflowName")?.value || '').trim(),
      smartClean: !!$("wfStepSmartClean")?.checked,
      dedupe: !!$("wfStepDedupe")?.checked,
      blank: !!$("wfStepBlank")?.checked,
      useTrim: !!$("wfUseTrim")?.checked,
      useNumber: !!$("wfUseNumber")?.checked,
      useDate: !!$("wfUseDate")?.checked,
      columns: getWorkflowSelectedColumns()
    };
  }

  function fillWorkflowForm(cfg){
    if(!cfg) return;
    if($("workflowName")) $("workflowName").value = cfg.name || '';
    [
      ["wfStepSmartClean","smartClean"],
      ["wfStepDedupe","dedupe"],
      ["wfStepBlank","blank"],
      ["wfUseTrim","useTrim"],
      ["wfUseNumber","useNumber"],
      ["wfUseDate","useDate"]
    ].forEach(([id,key])=>{ const el=$(id); if(el) el.checked = !!cfg[key]; });
    renderWorkflowColumns(cfg.columns || []);
  }

  function saveCurrentWorkflow(){
    const cfg = collectWorkflowConfig();
    if(!cfg.name) throw new Error('Workflow name required');
    let items = loadSavedWorkflows();
    items = items.filter(x=>x.name!==cfg.name);
    items.push(cfg);
    saveSavedWorkflows(items);
    renderWorkflowSavedList(cfg.name);
    success(`Đã lưu workflow "${cfg.name}".`);
  }

  function deleteCurrentWorkflow(){
    const name = $("workflowSavedList")?.value || $("workflowName")?.value.trim();
    if(!name) throw new Error('No workflow selected');
    let items = loadSavedWorkflows().filter(x=>x.name!==name);
    saveSavedWorkflows(items);
    renderWorkflowSavedList('');
    if($("workflowName")) $("workflowName").value = '';
    success(`Đã xóa workflow "${name}".`);
  }

  function runWorkflowConfig(cfg){
    if(!state.data.length) throw new Error('No data');
    let header = [...state.data[0]];
    let rows = state.data.slice(1).map(r=>[...r]);

    if(cfg.smartClean){
      header = header.map((h,i)=> isBlank(h) ? `Cột ${i+1}` : h);
      rows = rows.filter(row=>row.some(v=>!isBlank(v)));
      const seen = new Set();
      rows = rows.filter(row=>{
        const key = JSON.stringify(row.map(v=>v ?? ""));
        if(seen.has(key)) return false;
        seen.add(key); return true;
      });
      rows.forEach(row=>row.forEach((v,i)=>{
        let current = v;
        if(typeof current === 'string'){
          current = current.trim().replace(/\s+/g,' ');
          if(canConvertTextToNumber(current)) current = convertTextNumber(current);
        }
        row[i] = current;
      }));
    }

    if(cfg.blank){
      rows = rows.filter(row=>row.some(v=>!isBlank(v)));
    }
    if(cfg.dedupe){
      const seen = new Set();
      rows = rows.filter(row=>{
        const key = JSON.stringify(row.map(v=>v ?? ""));
        if(seen.has(key)) return false;
        seen.add(key); return true;
      });
    }

    const cols = (cfg.columns || []).filter(i=>i>=0);
    rows.forEach(row=>{
      cols.forEach(col=>{
        let current = row[col];
        if(cfg.useTrim && typeof current === 'string') current = current.trim().replace(/\s+/g,' ');
        if(cfg.useNumber && typeof current === 'string' && canConvertTextToNumber(current)) current = convertTextNumber(current);
        if(cfg.useDate){
          const dt = parseFlexibleDate(current);
          if(dt) current = formatDateOutput(dt, 'ddmmyyyy');
        }
        row[col] = current;
      });
    });

    state.data = normalizeRows([header, ...rows]);
    addHistory(`Chạy workflow "${cfg.name || 'Không tên'}".`);
  }

  function getBatchSelectedColumns(){
    return [...document.querySelectorAll(".batch-column-checkbox:checked")]
      .map(el=>Number(el.value))
      .filter(Number.isInteger);
  }

  function updateBatchSelectedCount(){
    const count=getBatchSelectedColumns().length;
    const input=$("batchSelectedCount");
    if(input) input.value=`${count} cột`;
  }

  function renderBatchColumns(){
    const root=$("batchColumnsList");
    if(!root) return;

    const headers=getHeaders();

    if(!headers.length){
      root.innerHTML='<p class="mobile-muted">Upload file để chọn cột.</p>';
      updateBatchSelectedCount();
      return;
    }

    root.innerHTML=headers.map((h,i)=>`
      <label class="batch-column-item">
        <input class="batch-column-checkbox" type="checkbox" value="${i}">
        <span>
          <strong title="${escapeHtml(h)}">${escapeHtml(h)}</strong>
          <small>Cột ${columnLetter(i)}</small>
        </span>
      </label>
    `).join("");

    root.querySelectorAll(".batch-column-checkbox").forEach(cb=>{
      cb.addEventListener("change",updateBatchSelectedCount);
    });

    updateBatchSelectedCount();
  }

  function applyBatchColumns(){
    const selected=getBatchSelectedColumns().sort((a,b)=>a-b);
    if(!selected.length){
      throw new Error("No columns selected");
    }

    const action=$("batchColumnAction")?.value || "trim";
    let header=[...state.data[0]];
    let rows=state.data.slice(1).map(r=>[...r]);

    let changed=0;

    if(action==="delete"){
      if(selected.length >= header.length){
        throw new Error("Cannot delete all columns");
      }

      [...selected].sort((a,b)=>b-a).forEach(col=>{
        header.splice(col,1);
        rows.forEach(row=>row.splice(col,1));
      });

      changed=selected.length;
      state.data=normalizeRows([header,...rows]);
      addHistory(`Xóa ${changed} cột cùng lúc.`);
      return;
    }

    rows.forEach(row=>{
      selected.forEach(col=>{
        const value=row[col];

        if(action==="trim" && typeof value==="string"){
          const next=value.trim().replace(/\s+/g," ");
          if(next!==value){
            row[col]=next;
            changed++;
          }
        }

        if(action==="number" && typeof value==="string" && canConvertTextToNumber(value)){
          row[col]=convertTextNumber(value);
          changed++;
        }

        if(["upper","lower","proper"].includes(action) && !isBlank(value)){
          const current=String(value);
          const next=
            action==="upper" ? current.toLocaleUpperCase("vi-VN") :
            action==="lower" ? current.toLocaleLowerCase("vi-VN") :
            properCase(current);

          if(next!==current){
            row[col]=next;
            changed++;
          }
        }
      });
    });

    state.data=normalizeRows([header,...rows]);

    const labels={
      trim:"TRIM",
      number:"Text → Number",
      upper:"UPPER CASE",
      lower:"lower case",
      proper:"Proper Case"
    };

    addHistory(`${labels[action] || action}: ${selected.length} cột · ${changed} ô thay đổi.`);
  }

  const REPORT_PRESETS = {
    sales:{
      name:"Báo cáo bán hàng",
      groupLabel:"Sản phẩm / Khu vực / Nhân viên",
      valueLabel:"Doanh thu / Amount",
      secondaryLabel:"Số lượng / Qty",
      ranking:"Top nhóm theo doanh thu",
      synonyms:{
        date:["date","ngay","time","created","order date","invoice date"],
        group:["product","san pham","item","region","khu vuc","salesperson","nhan vien","customer","khach hang"],
        value:["amount","revenue","sales","doanh thu","total","thanh tien","value"],
        secondary:["qty","quantity","so luong","sl","units"]
      }
    },
    qc:{
      name:"Báo cáo QC / Sản xuất",
      groupLabel:"Lot / Model / Defect",
      valueLabel:"Input",
      secondaryLabel:"NG",
      ranking:"Top nhóm theo NG",
      synonyms:{
        date:["date","ngay","time","production date","check date"],
        group:["lot","model","defect","loi","item","line","machine"],
        value:["input","qty input","production","total input"],
        secondary:["ng","ng qty","defect qty","reject","reject qty"]
      }
    },
    inventory:{
      name:"Báo cáo kho / Inventory",
      groupLabel:"Mã hàng / Sản phẩm",
      valueLabel:"Tồn / Stock",
      secondaryLabel:"Nhập / Xuất",
      ranking:"Top hàng theo tồn / giá trị",
      synonyms:{
        date:["date","ngay","time","transaction date"],
        group:["item","sku","ma hang","product","san pham","material"],
        value:["stock","inventory","ton","balance","ending stock","on hand"],
        secondary:["qty","quantity","nhap","xuat","movement","in","out"]
      }
    },
    hr:{
      name:"Báo cáo nhân sự",
      groupLabel:"Phòng ban / Nhân viên",
      valueLabel:"Giờ công / Công",
      secondaryLabel:"OT / Nghỉ",
      ranking:"Top nhóm theo giá trị",
      synonyms:{
        date:["date","ngay","work date","attendance date"],
        group:["department","phong ban","employee","nhan vien","team","group"],
        value:["hours","gio cong","workday","cong","working hours","days"],
        secondary:["ot","overtime","nghi","leave","late","absence"]
      }
    },
    custom:{
      name:"Báo cáo tùy chỉnh",
      groupLabel:"Nhóm chính",
      valueLabel:"Giá trị chính",
      secondaryLabel:"Giá trị phụ",
      ranking:"Top nhóm",
      synonyms:{
        date:["date","ngay","time"],
        group:["group","category","nhom","loai"],
        value:["value","amount","total","qty","quantity"],
        secondary:["secondary","count","qty","quantity"]
      }
    }
  };

  function normalizeHeaderForDetect(value){
    return normalizeSearchText(String(value || "")).trim();
  }

  function findHeaderBySynonyms(headers, synonyms, excluded=[]){
    const normalized=headers.map(normalizeHeaderForDetect);
    for(const synonym of synonyms){
      const s=normalizeHeaderForDetect(synonym);
      const exact=normalized.findIndex((h,i)=>!excluded.includes(i) && h===s);
      if(exact>=0) return exact;
    }
    for(const synonym of synonyms){
      const s=normalizeHeaderForDetect(synonym);
      const partial=normalized.findIndex((h,i)=>!excluded.includes(i) && (h.includes(s) || s.includes(h)));
      if(partial>=0) return partial;
    }
    return -1;
  }

  function setReportSelect(id,index){
    const el=$(id);
    if(!el) return;
    if(index>=0 && [...el.options].some(o=>Number(o.value)===index)){
      el.value=String(index);
    }
  }

  function applyReportPresetUI(presetKey){
    const preset=REPORT_PRESETS[presetKey] || REPORT_PRESETS.custom;
    state.reportPreset=presetKey;

    document.querySelectorAll(".report-preset").forEach(btn=>{
      btn.classList.toggle("active",btn.dataset.reportPreset===presetKey);
    });

    const groupLabel=$("reportGroupLabel");
    const valueLabel=$("reportValueLabel");
    const secondaryLabel=$("reportSecondaryLabel");

    if(groupLabel) groupLabel.childNodes[0].nodeValue=preset.groupLabel+"\n            ";
    if(valueLabel) valueLabel.childNodes[0].nodeValue=preset.valueLabel+"\n            ";
    if(secondaryLabel) secondaryLabel.childNodes[0].nodeValue=preset.secondaryLabel+"\n            ";

    const title=$("reportPreviewTitle");
    if(title) title.textContent=preset.name;

    const ranking=$("reportRankingTitle");
    if(ranking) ranking.textContent=preset.ranking;

    const sheetInput=$("reportSheetName");
    if(sheetInput){
      const autoNames=Object.values(REPORT_PRESETS).map(x=>x.name.slice(0,31));
      if(
        !sheetInput.dataset.userEdited ||
        sheetInput.value==="Auto Report" ||
        autoNames.includes(sheetInput.value)
      ){
        sheetInput.value=preset.name.slice(0,31);
      }
    }

    const msg=$("reportDetectMessage");
    if(msg) msg.textContent="";

    /*
      Nếu đã có dữ liệu thì đổi preset sẽ tự nhận diện lại cột,
      giúp người dùng không phải bấm thêm lần nữa.
    */
    if(state.data.length){
      autoDetectReportColumns();

      try{
        const report=buildReportData();
        state.reportPreview=report;
        renderReportPreview(report);
      }catch(e){
        const preview=$("mobileReportPreview");
        if(preview) preview.hidden=true;
      }
    }
  }

  function autoDetectReportColumns(){
    if(!state.data.length){
      error("Hãy upload file trước.");
      return;
    }

    const headers=getHeaders();
    const preset=REPORT_PRESETS[state.reportPreset] || REPORT_PRESETS.custom;
    const used=[];

    const date=findHeaderBySynonyms(headers,preset.synonyms.date,used);
    if(date>=0) used.push(date);

    const group=findHeaderBySynonyms(headers,preset.synonyms.group,used);
    if(group>=0) used.push(group);

    const value=findHeaderBySynonyms(headers,preset.synonyms.value,used);
    if(value>=0) used.push(value);

    const secondary=findHeaderBySynonyms(headers,preset.synonyms.secondary,used);

    setReportSelect("reportDateColumn",date);
    setReportSelect("reportGroupColumn",group);
    setReportSelect("reportValueColumn",value);
    setReportSelect("reportSecondaryColumn",secondary);

    const found=[
      ["Ngày",date],
      ["Nhóm",group],
      ["Giá trị chính",value],
      ["Giá trị phụ",secondary]
    ].filter(x=>x[1]>=0);

    const msg=$("reportDetectMessage");
    if(msg){
      msg.textContent=found.length
        ? `✓ Đã nhận diện ${found.length}/4 trường: ${found.map(x=>x[0]).join(", ")}.`
        : "Chưa tự nhận diện được. Hãy chọn cột thủ công.";
    }
  }

  function sumNumeric(rows,col){
    if(col<0) return 0;
    return rows.reduce((sum,row)=>{
      const n=Number(row[col]);
      return sum+(Number.isFinite(n)?n:0);
    },0);
  }

  function averageNumeric(rows,col){
    if(col<0) return 0;
    const nums=rows.map(r=>Number(r[col])).filter(Number.isFinite);
    return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : 0;
  }

  function formatReportNumber(value){
    if(!Number.isFinite(value)) return "0";
    return new Intl.NumberFormat("vi-VN",{maximumFractionDigits:2}).format(value);
  }

  function buildReportData(){
    if(!state.data.length) throw new Error("No data");

    const rows=state.data.slice(1).filter(row=>row.some(v=>!isBlank(v)));
    const headers=getHeaders();

    const dateCol=Number($("reportDateColumn")?.value ?? -1);
    const groupCol=Number($("reportGroupColumn")?.value ?? -1);
    const valueCol=Number($("reportValueColumn")?.value ?? -1);
    const secondaryCol=Number($("reportSecondaryColumn")?.value ?? -1);
    const topN=Math.max(3,Math.min(20,Number($("reportTopN")?.value)||5));

    if(groupCol<0 || valueCol<0){
      throw new Error("Need group and value");
    }

    const groups=new Map();

    rows.forEach(row=>{
      const key=String(row[groupCol] ?? "").trim() || "(Trống)";
      if(!groups.has(key)){
        groups.set(key,{name:key,count:0,value:0,secondary:0});
      }
      const item=groups.get(key);
      item.count++;

      const v=Number(row[valueCol]);
      if(Number.isFinite(v)) item.value+=v;

      const s=Number(row[secondaryCol]);
      if(Number.isFinite(s)) item.secondary+=s;
    });

    let ranking=[...groups.values()];

    /*
      QC thường cần ưu tiên NG (secondary).
      Các preset khác xếp theo value.
    */
    const rankingMetric=state.reportPreset==="qc" ? "secondary" : "value";
    ranking.sort((a,b)=>b[rankingMetric]-a[rankingMetric]);

    const totalValue=sumNumeric(rows,valueCol);
    const totalSecondary=sumNumeric(rows,secondaryCol);
    const avgValue=averageNumeric(rows,valueCol);

    const preset=REPORT_PRESETS[state.reportPreset] || REPORT_PRESETS.custom;

    let kpis=[
      {label:"Số dòng",value:rows.length},
      {label:headers[valueCol] || "Tổng giá trị",value:formatReportNumber(totalValue)},
      {label:"Trung bình",value:formatReportNumber(avgValue)},
      {label:headers[secondaryCol] || "Giá trị phụ",value:formatReportNumber(totalSecondary)}
    ];

    if(state.reportPreset==="qc"){
      const rate=totalValue>0 ? totalSecondary/totalValue : 0;
      kpis=[
        {label:"Tổng Input",value:formatReportNumber(totalValue)},
        {label:"Tổng NG",value:formatReportNumber(totalSecondary)},
        {label:"NG Rate",value:(rate*100).toFixed(2)+"%"},
        {label:"Số dòng",value:rows.length}
      ];
    }

    if(state.reportPreset==="sales"){
      kpis=[
        {label:"Tổng doanh thu",value:formatReportNumber(totalValue)},
        {label:"Số dòng / đơn",value:rows.length},
        {label:"TB / dòng",value:formatReportNumber(avgValue)},
        {label:"Tổng số lượng",value:formatReportNumber(totalSecondary)}
      ];
    }

    return {
      preset,
      headers,
      rows,
      dateCol,
      groupCol,
      valueCol,
      secondaryCol,
      topN,
      rankingMetric,
      ranking:ranking.slice(0,topN),
      groups:[...groups.values()],
      totalValue,
      totalSecondary,
      avgValue,
      kpis
    };
  }

  function renderReportPreview(report){
    const root=$("mobileReportPreview");
    if(!root) return;
    root.hidden=false;

    $("reportPreviewTitle").textContent=report.preset.name;
    $("reportPreviewRows").textContent=`${report.rows.length} dòng`;

    $("mobileReportKpis").innerHTML=report.kpis.map(k=>
      `<div class="mobile-report-kpi"><small>${escapeHtml(k.label)}</small><strong>${escapeHtml(k.value)}</strong></div>`
    ).join("");

    const max=Math.max(
      1,
      ...report.ranking.map(x=>Number(x[report.rankingMetric])||0)
    );

    $("mobileReportBars").innerHTML=report.ranking.length
      ? report.ranking.map(item=>{
          const val=Number(item[report.rankingMetric])||0;
          const pct=Math.max(1,(val/max)*100);
          return `<div class="mobile-report-bar-row">
            <span class="mobile-report-bar-label" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
            <span class="mobile-report-bar-track"><span class="mobile-report-bar-fill" style="width:${pct}%"></span></span>
            <span class="mobile-report-bar-value">${escapeHtml(formatReportNumber(val))}</span>
          </div>`;
        }).join("")
      : `<p class="mobile-muted">Không có dữ liệu nhóm.</p>`;
  }

  function createAutoReportSheet(){
    const report=buildReportData();
    state.reportPreview=report;
    renderReportPreview(report);

    const sheetName=($("reportSheetName")?.value.trim() || "Auto Report").slice(0,31);

    const aoa=[];
    aoa.push([report.preset.name]);
    aoa.push(["Tạo bởi","Excel Mobile Processor"]);
    aoa.push(["Nguồn dữ liệu",state.sheetName]);
    aoa.push([]);

    report.kpis.forEach(k=>aoa.push([k.label,k.value]));
    aoa.push([]);

    aoa.push(["TOP NHÓM", "Số dòng", "Giá trị chính", "Giá trị phụ"]);
    report.ranking.forEach(item=>{
      aoa.push([
        item.name,
        item.count,
        item.value,
        item.secondary
      ]);
    });

    aoa.push([]);
    aoa.push(["TỔNG HỢP TẤT CẢ NHÓM","Số dòng","Giá trị chính","Giá trị phụ"]);
    [...report.groups]
      .sort((a,b)=>b[report.rankingMetric]-a[report.rankingMetric])
      .forEach(item=>{
        aoa.push([item.name,item.count,item.value,item.secondary]);
      });

    const ws=XLSX.utils.aoa_to_sheet(aoa);

    /* Basic column widths supported by SheetJS */
    ws["!cols"]=[
      {wch:28},
      {wch:16},
      {wch:18},
      {wch:18}
    ];

    /* Replace existing report sheet with same name */
    if(state.workbook.Sheets[sheetName]){
      delete state.workbook.Sheets[sheetName];
      state.workbook.SheetNames=state.workbook.SheetNames.filter(n=>n!==sheetName);
    }

    XLSX.utils.book_append_sheet(state.workbook,ws,sheetName);

    addHistory(`Tạo ${report.preset.name} trong Sheet "${sheetName}".`);
    downloadBtn.disabled=false;
    shareBtn.disabled=false;

    success(`Đã tạo Sheet "${sheetName}". Kiểm tra preview rồi tải file.`);
  }

  function canConvertTextToNumber(value){
    if(typeof value !== "string") return false;
    const raw=value.trim();
    if(raw==="") return false;

    let normalized=raw;

    if(/^-?\d{1,3}(\.\d{3})+,\d+$/.test(raw)){
      normalized=raw.replace(/\./g,"").replace(",",".");
    }else if(/^-?\d+,\d+$/.test(raw)){
      normalized=raw.replace(",",".");
    }else{
      normalized=raw.replace(/\s+/g,"");
    }

    return Number.isFinite(Number(normalized));
  }

  function convertTextNumber(value){
    const raw=String(value).trim();
    let normalized=raw;

    if(/^-?\d{1,3}(\.\d{3})+,\d+$/.test(raw)){
      normalized=raw.replace(/\./g,"").replace(",",".");
    }else if(/^-?\d+,\d+$/.test(raw)){
      normalized=raw.replace(",",".");
    }else{
      normalized=raw.replace(/\s+/g,"");
    }

    return Number(normalized);
  }

  function scanSmartClean(){
    if(!state.data.length){
      error("Hãy upload file trước khi quét.");
      return;
    }

    const header=state.data[0] || [];
    const rows=state.data.slice(1);

    let blankRows=0;
    let extraSpaces=0;
    let numberText=0;
    let blankHeaders=0;

    header.forEach(h=>{
      if(isBlank(h)) blankHeaders++;
    });

    rows.forEach(row=>{
      if(row.every(isBlank)){
        blankRows++;
      }

      row.forEach(v=>{
        if(typeof v === "string"){
          const trimmed=v.trim().replace(/\s+/g," ");
          if(trimmed !== v){
            extraSpaces++;
          }
          if(canConvertTextToNumber(v)){
            numberText++;
          }
        }
      });
    });

    const seen=new Set();
    let duplicates=0;

    rows.forEach(row=>{
      const key=JSON.stringify(row.map(v=>v ?? ""));
      if(seen.has(key)){
        duplicates++;
      }else{
        seen.add(key);
      }
    });

    const report={
      duplicates,
      blankRows,
      extraSpaces,
      numberText,
      blankHeaders
    };

    state.smartCleanReport=report;
    renderSmartCleanReport(report);

    const total=
      duplicates+
      blankRows+
      extraSpaces+
      numberText+
      blankHeaders;

    if(total===0){
      success("Không phát hiện vấn đề dữ liệu phổ biến.");
    }else{
      success(`Đã phát hiện ${total} vấn đề. Chọn mục cần sửa rồi bấm Xử lý file.`);
    }
  }

  function renderSmartCleanReport(report){
    const root=$("smartCleanReport");
    if(!root) return;

    root.hidden=false;

    const total=
      report.duplicates+
      report.blankRows+
      report.extraSpaces+
      report.numberText+
      report.blankHeaders;

    $("smartCleanIssueCount").textContent=`${total} vấn đề`;
    $("smartDuplicateCount").textContent=`${report.duplicates} dòng`;
    $("smartBlankRowCount").textContent=`${report.blankRows} dòng`;
    $("smartSpaceCount").textContent=`${report.extraSpaces} ô`;
    $("smartNumberTextCount").textContent=`${report.numberText} ô`;
    $("smartHeaderCount").textContent=`${report.blankHeaders} cột`;

    [
      ["smartFixDuplicates",report.duplicates],
      ["smartFixBlankRows",report.blankRows],
      ["smartFixSpaces",report.extraSpaces],
      ["smartFixNumberText",report.numberText],
      ["smartFixHeaders",report.blankHeaders]
    ].forEach(([id,count])=>{
      const input=$(id);
      const label=input?.closest(".smart-clean-option");
      if(!input || !label) return;

      input.disabled=count===0;
      if(count===0){
        input.checked=false;
        label.classList.add("no-issue");
      }else{
        input.checked=true;
        label.classList.remove("no-issue");
      }
    });
  }

  function applySmartClean(){
    if(!state.data.length){
      throw new Error("No data");
    }

    if(!state.smartCleanReport){
      scanSmartClean();
      throw new Error("Scan first");
    }

    let header=[...state.data[0]];
    let rows=state.data.slice(1).map(r=>[...r]);
    const changes=[];

    if($("smartFixHeaders")?.checked){
      let changed=0;
      header=header.map((h,i)=>{
        if(isBlank(h)){
          changed++;
          return `Cột ${i+1}`;
        }
        return h;
      });
      if(changed) changes.push(`${changed} tiêu đề cột`);
    }

    if($("smartFixBlankRows")?.checked){
      const before=rows.length;
      rows=rows.filter(row=>row.some(v=>!isBlank(v)));
      const changed=before-rows.length;
      if(changed) changes.push(`${changed} dòng trống`);
    }

    if($("smartFixDuplicates")?.checked){
      const seen=new Set();
      const before=rows.length;
      rows=rows.filter(row=>{
        const key=JSON.stringify(row.map(v=>v ?? ""));
        if(seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      const changed=before-rows.length;
      if(changed) changes.push(`${changed} dòng trùng`);
    }

    let spacesChanged=0;
    let numbersChanged=0;

    rows.forEach(row=>{
      row.forEach((v,i)=>{
        if(typeof v !== "string") return;

        let current=v;

        if($("smartFixSpaces")?.checked){
          const trimmed=current.trim().replace(/\s+/g," ");
          if(trimmed !== current){
            current=trimmed;
            spacesChanged++;
          }
        }

        if($("smartFixNumberText")?.checked && canConvertTextToNumber(current)){
          current=convertTextNumber(current);
          numbersChanged++;
        }

        row[i]=current;
      });
    });

    if(spacesChanged) changes.push(`${spacesChanged} ô khoảng trắng`);
    if(numbersChanged) changes.push(`${numbersChanged} số dạng Text`);

    state.data=normalizeRows([header,...rows]);
    state.smartCleanReport=null;
    state.previewSearch="";
    state.editingCell=null;
    const dataSearch=$("mobileDataSearch");
    if(dataSearch) dataSearch.value="";
    $("mobileDataSearchClear")?.classList.remove("show");

    const reportRoot=$("smartCleanReport");
    if(reportRoot) reportRoot.hidden=true;

    addHistory(
      changes.length
        ? `Smart Clean: ${changes.join(", ")}.`
        : "Smart Clean: không có mục nào được thay đổi."
    );
  }

  async function loadMergeFiles(fileList){
    const files=[...fileList];
    state.mergeFiles=[];
    state.smartCleanReport=null;
    state.performanceMode=false;
    state.fileSizeBytes=0;
    state.previewLimit=30;
    state.searchLimit=100;
    const perfBar=$("mobilePerformanceBar");
    if(perfBar) perfBar.hidden=true;

    for(const file of files){
      try{
        const buffer=await file.arrayBuffer();
        const wb=XLSX.read(buffer,{type:"array",cellDates:true});
        state.mergeFiles.push({
          name:file.name,
          workbook:wb
        });
      }catch(e){
        console.warn("Không đọc được file:",file.name,e);
      }
    }

    renderMergeFilesInfo();
  }

  function renderMergeFilesInfo(){
    const root=$("mergeFilesInfo");
    if(!root) return;

    if(!state.mergeFiles.length){
      root.textContent="Chưa chọn file nào.";
      return;
    }

    root.innerHTML=
      `<strong>Đã chọn ${state.mergeFiles.length} file:</strong>`+
      `<ul class="mobile-merge-file-list">${
        state.mergeFiles.map(f=>`<li>${escapeHtml(f.name)}</li>`).join("")
      }</ul>`;
  }

  function normalizeHeaderName(value,index){
    const text=String(value ?? "").trim();
    return text || `Cột ${index+1}`;
  }

  function mergeFilesByHeader(datasets){
    const allHeaders=[];
    const seen=new Set();

    datasets.forEach(item=>{
      item.headers.forEach(h=>{
        if(!seen.has(h)){
          seen.add(h);
          allHeaders.push(h);
        }
      });
    });

    const rows=[allHeaders];

    datasets.forEach(item=>{
      const indexMap=new Map(item.headers.map((h,i)=>[h,i]));
      item.rows.forEach(row=>{
        rows.push(allHeaders.map(h=>{
          const idx=indexMap.get(h);
          return idx===undefined ? "" : (row[idx] ?? "");
        }));
      });
    });

    return rows;
  }

  function mergeFilesByPosition(datasets){
    const maxCols=Math.max(
      0,
      ...datasets.map(d=>d.headers.length)
    );

    const firstHeaders=datasets[0]?.headers || [];
    const headers=Array.from({length:maxCols},(_,i)=>
      firstHeaders[i] || `Cột ${i+1}`
    );

    const rows=[headers];

    datasets.forEach(item=>{
      item.rows.forEach(row=>{
        const out=[...row];
        while(out.length<maxCols) out.push("");
        rows.push(out.slice(0,maxCols));
      });
    });

    return rows;
  }

  function getMergeSheetForWorkbook(wb){
    const mode=$("mergeFilesSheetMode")?.value || "first";

    if(mode==="first"){
      const name=wb.SheetNames[0];
      return name ? {name,ws:wb.Sheets[name]} : null;
    }

    const requested=$("mergeFilesSheetName")?.value.trim();
    if(!requested) return null;
    if(!wb.Sheets[requested]) return null;
    return {name:requested,ws:wb.Sheets[requested]};
  }

  function processMergeFiles(){
    if(!state.mergeFiles.length){
      throw new Error("No merge files");
    }

    const datasets=[];
    const skipped=[];

    state.mergeFiles.forEach(file=>{
      const picked=getMergeSheetForWorkbook(file.workbook);

      if(!picked){
        skipped.push(file.name);
        return;
      }

      const data=normalizeRows(
        XLSX.utils.sheet_to_json(
          picked.ws,
          {header:1,defval:"",raw:true}
        )
      );

      if(!data.length){
        skipped.push(file.name);
        return;
      }

      const headers=(data[0] || []).map(normalizeHeaderName);
      const rows=data.slice(1).filter(row=>row.some(v=>!isBlank(v)));

      datasets.push({
        file:file.name,
        sheet:picked.name,
        headers,
        rows
      });
    });

    if(!datasets.length){
      throw new Error("No usable datasets");
    }

    const mode=$("mergeFilesMode")?.value || "header";

    const merged = mode==="header"
      ? mergeFilesByHeader(datasets)
      : mergeFilesByPosition(datasets);

    const sheetName=$("mergeFilesOutputSheet")?.value.trim() || "Merged Data";
    const wb=XLSX.utils.book_new();
    const ws=XLSX.utils.aoa_to_sheet(merged);
    XLSX.utils.book_append_sheet(wb,ws,sheetName.slice(0,31));

    state.workbook=wb;
    state.originalName="merged-files.xlsx";
    state.sheetName=wb.SheetNames[0];
    state.data=normalizeRows(merged);
    state.undoStack=[];

    sheetSelect.innerHTML=
      `<option value="${escapeHtml(state.sheetName)}">${escapeHtml(state.sheetName)}</option>`;
    sheetSelect.value=state.sheetName;
    sheetSelect.disabled=false;

    processBtn.disabled=false;
    downloadBtn.disabled=false;
    shareBtn.disabled=false;
    resetBtn.disabled=false;

    renderPreview();
    populateColumns();
    populateLookupSheets();

    const totalRows=Math.max(0,merged.length-1);
    const summary=$("mergeFilesSummary");
    if(summary){
      summary.hidden=false;
      summary.innerHTML=
        `<strong>✓ Gộp thành công</strong><br>`+
        `${datasets.length} file được gộp · ${totalRows} dòng dữ liệu · ${merged[0]?.length || 0} cột`+
        (skipped.length
          ? `<br>⚠ Bỏ qua ${skipped.length} file không có Sheet phù hợp.`
          : "");
    }

    $("mobileFileInfo").hidden=false;
    $("mobileFileInfo").textContent=
      `📚 File tổng hợp · ${datasets.length} file nguồn · ${totalRows} dòng`;

    addHistory(
      `Gộp ${datasets.length} file Excel thành ${totalRows} dòng (${mode==="header"?"theo tên cột":"theo vị trí cột"}).`
    );

    success("Gộp file thành công. Kiểm tra preview rồi tải file kết quả.");
  }

  function runTool(){
    if(activeTool === "mergefiles"){
      try{
        processMergeFiles();
      }catch(e){
        console.error(e);
        error("Không thể gộp file. Hãy kiểm tra file và cấu hình Sheet.");
      }
      return;
    }

    if(activeTool === "smartclean"){
      if(!state.data.length){
        error("Hãy upload file trước.");
        return;
      }

      try{
        pushUndoSnapshot();
        applySmartClean();
        updateWorkbookSheet();
        renderPreview();
        populateColumns();
        populateLookupSheets();
        downloadBtn.disabled=false;
        shareBtn.disabled=false;
        success("Smart Clean đã xử lý xong. Hãy kiểm tra preview.");
      }catch(e){
        console.error(e);

        if(state.undoStack.length){
          state.undoStack.pop();
          if(undoBtn) undoBtn.disabled = state.undoStack.length === 0;
        }

        if(String(e?.message)!=="Scan first"){
          error("Không thể Smart Clean dữ liệu.");
        }
      }
      return;
    }

    if(activeTool === "autoreport"){
      if(!state.data.length){
        error("Hãy upload file trước.");
        return;
      }

      try{
        createAutoReportSheet();
      }catch(e){
        console.error(e);
        error("Không thể tạo báo cáo. Hãy chọn tối thiểu cột Nhóm chính và Giá trị chính.");
      }
      return;
    }

    if(activeTool === "batchcols"){
      if(!state.data.length){
        error("Hãy upload file trước.");
        return;
      }

      try{
        const selected=getBatchSelectedColumns();
        if(!selected.length){
          error("Hãy chọn ít nhất 1 cột.");
          return;
        }

        pushUndoSnapshot();
        applyBatchColumns();
        updateWorkbookSheet();
        renderPreview();
        populateColumns();
        populateLookupSheets();
        renderBatchColumns();

        downloadBtn.disabled=false;
        shareBtn.disabled=false;
        success("Đã xử lý nhiều cột cùng lúc.");
      }catch(e){
        console.error(e);

        if(state.undoStack.length){
          state.undoStack.pop();
          if(undoBtn) undoBtn.disabled=state.undoStack.length===0;
        }

        if(String(e?.message)==="Cannot delete all columns"){
          error("Không thể xóa toàn bộ cột trong Sheet.");
        }else{
          error("Không thể xử lý. Hãy kiểm tra các cột đã chọn.");
        }
      }
      return;
    }

    if(activeTool === "quickpivot"){
      if(!state.data.length){
        error("Hãy upload file trước.");
        return;
      }

      try{
        createQuickPivotSheet();
      }catch(e){
        console.error(e);
        if(String(e?.message)==="Same group columns"){
          error("Nhóm chính và Nhóm phụ không được chọn cùng một cột.");
        }else{
          error("Không thể tạo Pivot. Hãy kiểm tra cột Nhóm và cột Giá trị.");
        }
      }
      return;
    }


    if(activeTool === "datetools"){
      if(!state.data.length){ error("Hãy upload file trước."); return; }
      try{
        pushUndoSnapshot();
        applyDateTools();
        updateWorkbookSheet();
        renderPreview();
        populateColumns();
        populateLookupSheets();
        renderBatchColumns();
        populatePivotSecondGroup();
        renderWorkflowColumns();
        downloadBtn.disabled=false; shareBtn.disabled=false;
        success("Đã xử lý Date Tools.");
      }catch(e){
        console.error(e);
        if(state.undoStack.length){ state.undoStack.pop(); if(undoBtn) undoBtn.disabled = state.undoStack.length===0; }
        error("Không thể xử lý ngày tháng. Hãy kiểm tra cột đã chọn.");
      }
      return;
    }

    if(activeTool === "errorcheck"){
      if(!state.data.length){ error("Hãy upload file trước."); return; }
      try{
        pushUndoSnapshot();
        applyErrorIssues();
        updateWorkbookSheet();
        renderPreview();
        downloadBtn.disabled=false; shareBtn.disabled=false;
        success("Đã xử lý lỗi dữ liệu.");
      }catch(e){
        console.error(e);
        if(state.undoStack.length){ state.undoStack.pop(); if(undoBtn) undoBtn.disabled = state.undoStack.length===0; }
        error("Không thể xử lý lỗi dữ liệu.");
      }
      return;
    }

    if(activeTool === "quickchart"){
      if(!state.data.length){ error("Hãy upload file trước."); return; }
      try{
        createQuickChartSheet();
      }catch(e){
        console.error(e);
        error("Không thể tạo biểu đồ. Hãy kiểm tra cột nhãn và cột giá trị.");
      }
      return;
    }

    if(activeTool === "workflows"){
      error("Hãy dùng nút Lưu / Chạy workflow trong phần Quy trình xử lý.");
      return;
    }

    if(!state.data.length){
      error("Hãy upload file Excel trước.");
      return;
    }

    const header = [...state.data[0]];
    let rows = state.data.slice(1).map(r=>[...r]);

    try{
      pushUndoSnapshot();
      if(activeTool === "dedupe"){
        const seen=new Set();
        const before=rows.length;
        rows=rows.filter(row=>{
          const key=JSON.stringify(row.map(v=>v ?? ""));
          if(seen.has(key)) return false;
          seen.add(key); return true;
        });
        state.data=normalizeRows([header,...rows]);
        addHistory(`Xóa ${before-rows.length} dòng trùng trong ${state.sheetName}.`);
      }

      if(activeTool === "blank"){
        const before=rows.length;
        rows=rows.filter(row=>row.some(v=>!isBlank(v)));
        state.data=normalizeRows([header,...rows]);
        addHistory(`Xóa ${before-rows.length} dòng trống trong ${state.sheetName}.`);
      }

      if(activeTool === "trim"){
        const col=Number($("trimColumn").value);
        rows.forEach(row=>{
          if(typeof row[col] === "string"){
            row[col]=row[col].trim().replace(/\s+/g," ");
          }
        });
        state.data=normalizeRows([header,...rows]);
        addHistory(`TRIM cột ${getHeaders()[col]}.`);
      }

      if(activeTool === "case"){
        const col=Number($("caseColumn").value);
        const mode=$("caseMode").value;
        rows.forEach(row=>{
          if(isBlank(row[col])) return;
          const value=String(row[col]);
          row[col] =
            mode==="upper" ? value.toLocaleUpperCase("vi-VN") :
            mode==="lower" ? value.toLocaleLowerCase("vi-VN") :
            properCase(value);
        });
        state.data=normalizeRows([header,...rows]);
        addHistory(`Đổi kiểu chữ (${mode}) cho cột ${getHeaders()[col]}.`);
      }

      if(activeTool === "pad"){
        const col=Number($("padColumn").value);
        const len=Math.max(1,Number($("padLength").value)||1);
        rows.forEach(row=>{
          if(isBlank(row[col])) return;
          row[col]=String(row[col]).padStart(len,"0");
        });
        state.data=normalizeRows([header,...rows]);
        addHistory(`Chuẩn hóa cột ${getHeaders()[col]} đủ ${len} ký tự bằng số 0.`);
      }

      if(activeTool === "sort"){
        const col=Number($("sortColumn").value);
        const dir=$("sortDirection").value;
        rows.sort((a,b)=>{
          const result=smartCompare(a[col],b[col]);
          return dir==="desc" ? -result : result;
        });
        state.data=normalizeRows([header,...rows]);
        addHistory(`Sort cột ${getHeaders()[col]} ${dir==="desc"?"giảm dần":"tăng dần"}.`);
      }

      if(activeTool === "ngrate"){
        const inputCol=Number($("ngInputColumn").value);
        const ngCol=Number($("ngQtyColumn").value);
        const name=$("ngRateName").value.trim() || "NG Rate";

        let target=header.findIndex(h=>String(h).trim().toLowerCase()===name.toLowerCase());
        if(target<0){
          target=header.length;
          header.push(name);
          rows.forEach(r=>r.push(""));
        }

        rows.forEach(row=>{
          const input=Number(row[inputCol]);
          const ng=Number(row[ngCol]);
          row[target] = input > 0 && Number.isFinite(ng) ? ng/input : "";
        });
        state.data=normalizeRows([header,...rows]);
        addHistory(`Tạo cột ${name} = ${getHeaders()[ngCol]} ÷ ${getHeaders()[inputCol]}.`);
      }

      if(activeTool === "okng"){
        const col=Number($("okngColumn").value);
        const operator=$("okngOperator").value;
        const spec=Number($("okngSpec").value);
        const name=$("okngName").value.trim() || "Result";

        let target=header.findIndex(h=>String(h).trim().toLowerCase()===name.toLowerCase());
        if(target<0){
          target=header.length;
          header.push(name);
          rows.forEach(r=>r.push(""));
        }

        rows.forEach(row=>{
          const val=Number(row[col]);
          if(!Number.isFinite(val)){row[target]="";return;}
          const ok =
            operator==="<=" ? val<=spec :
            operator===">=" ? val>=spec :
            operator==="<" ? val<spec :
            val>spec;
          row[target]=ok ? "OK" : "NG";
        });
        state.data=normalizeRows([header,...rows]);
        addHistory(`Tạo cột ${name}: ${getHeaders()[col]} ${operator} ${spec} → OK.`);
      }

      if(activeTool === "ifbuilder"){
        const col=Number($("ifColumn").value);
        const operator=$("ifOperator").value;
        const compareRaw=$("ifCompareValue").value;
        const trueValue=$("ifTrueValue").value;
        const falseValue=$("ifFalseValue").value;
        const name=$("ifOutputName").value.trim() || "IF Result";

        let target=header.findIndex(h=>String(h).trim().toLowerCase()===name.toLowerCase());
        if(target<0){
          target=header.length;
          header.push(name);
          rows.forEach(r=>r.push(""));
        }

        function compareValues(left,right,op){
          const ln=Number(left), rn=Number(right);
          const numeric=Number.isFinite(ln) && Number.isFinite(rn) &&
            String(left).trim()!=="" && String(right).trim()!=="";
          const a=numeric ? ln : String(left ?? "").trim();
          const b=numeric ? rn : String(right ?? "").trim();

          return op==="<=" ? a<=b :
                 op===">=" ? a>=b :
                 op==="<"  ? a<b :
                 op===">"  ? a>b :
                 op==="!=" ? a!=b :
                 a==b;
        }

        rows.forEach(row=>{
          row[target]=compareValues(row[col],compareRaw,operator) ? trueValue : falseValue;
        });

        state.data=normalizeRows([header,...rows]);
        addHistory(`IF Builder: ${getHeaders()[col]} ${operator} ${compareRaw} → ${name}.`);
      }

      if(activeTool === "lookup"){
        const sourceCol=Number($("lookupSourceColumn").value);
        const lookupSheetName=$("lookupSheet").value;
        const keyCol=Number($("lookupKeyColumn").value);
        const returnCol=Number($("lookupReturnColumn").value);
        const name=$("lookupOutputName").value.trim() || "Lookup Result";
        const notFound=$("lookupNotFound").value;

        const lookupRows=getSheetRows(lookupSheetName);
        if(lookupRows.length < 2) throw new Error("Lookup sheet empty");

        const lookupMap=new Map();
        lookupRows.slice(1).forEach(r=>{
          const key=String(r[keyCol] ?? "").trim();
          if(key && !lookupMap.has(key)) lookupMap.set(key,r[returnCol]);
        });

        let target=header.findIndex(h=>String(h).trim().toLowerCase()===name.toLowerCase());
        if(target<0){
          target=header.length;
          header.push(name);
          rows.forEach(r=>r.push(""));
        }

        let found=0;
        rows.forEach(row=>{
          const key=String(row[sourceCol] ?? "").trim();
          if(lookupMap.has(key)){
            row[target]=lookupMap.get(key);
            found++;
          }else{
            row[target]=notFound;
          }
        });

        state.data=normalizeRows([header,...rows]);
        addHistory(`Tra cứu ${found}/${rows.length} dòng từ Sheet ${lookupSheetName}.`);
      }

      if(activeTool === "split"){
        const col=Number($("splitColumn").value);
        const delimiter=$("splitDelimiter").value;
        const name1=$("splitName1").value.trim() || "Phần 1";
        const name2=$("splitName2").value.trim() || "Phần 2";

        if(delimiter==="") throw new Error("Delimiter empty");

        let target1=header.findIndex(h=>String(h).trim().toLowerCase()===name1.toLowerCase());
        if(target1<0){
          target1=header.length;
          header.push(name1);
          rows.forEach(r=>r.push(""));
        }

        let target2=header.findIndex(h=>String(h).trim().toLowerCase()===name2.toLowerCase());
        if(target2<0){
          target2=header.length;
          header.push(name2);
          rows.forEach(r=>r.push(""));
        }

        rows.forEach(row=>{
          const text=String(row[col] ?? "");
          const parts=text.split(delimiter);
          row[target1]=parts[0] ?? "";
          row[target2]=parts.slice(1).join(delimiter) || "";
        });

        state.data=normalizeRows([header,...rows]);
        addHistory(`Tách cột ${getHeaders()[col]} theo "${delimiter}".`);
      }

      if(activeTool === "merge"){
        const col1=Number($("mergeColumn1").value);
        const col2=Number($("mergeColumn2").value);
        const separator=$("mergeSeparator").value;
        const name=$("mergeOutputName").value.trim() || "Merged";

        let target=header.findIndex(h=>String(h).trim().toLowerCase()===name.toLowerCase());
        if(target<0){
          target=header.length;
          header.push(name);
          rows.forEach(r=>r.push(""));
        }

        rows.forEach(row=>{
          const a=String(row[col1] ?? "").trim();
          const b=String(row[col2] ?? "").trim();
          row[target]=[a,b].filter(Boolean).join(separator);
        });

        state.data=normalizeRows([header,...rows]);
        addHistory(`Gộp ${getHeaders()[col1]} + ${getHeaders()[col2]} → ${name}.`);
      }

      if(activeTool === "replace"){
        const col=Number($("replaceColumn").value);
        const findValue=$("replaceFind").value;
        const replaceValue=$("replaceWith").value;
        const mode=$("replaceMode").value;

        if(findValue==="") throw new Error("Find value empty");

        let count=0;
        rows.forEach(row=>{
          const original=String(row[col] ?? "");
          if(mode==="exact"){
            if(original===findValue){
              row[col]=replaceValue;
              count++;
            }
          }else if(original.includes(findValue)){
            const parts=original.split(findValue);
            count += Math.max(0,parts.length-1);
            row[col]=parts.join(replaceValue);
          }
        });

        state.data=normalizeRows([header,...rows]);
        addHistory(`Tìm & thay thế ${count} vị trí trong cột ${getHeaders()[col]}.`);
      }

      if(activeTool === "fillblank"){
        const col=Number($("fillBlankColumn").value);
        const fill=$("fillBlankValue").value;
        let count=0;

        rows.forEach(row=>{
          if(isBlank(row[col])){
            row[col]=fill;
            count++;
          }
        });

        state.data=normalizeRows([header,...rows]);
        addHistory(`Điền ${count} ô trống trong cột ${getHeaders()[col]}.`);
      }

      if(activeTool === "tonumber"){
        const col=Number($("toNumberColumn").value);
        let converted=0;

        rows.forEach(row=>{
          if(isBlank(row[col])) return;

          if(typeof row[col] === "number") return;

          const raw=String(row[col]).trim();
          let normalized=raw;

          /* 1.234,56 -> 1234.56 ; 12,5 -> 12.5 */
          if(/^-?\d{1,3}(\.\d{3})+,\d+$/.test(raw)){
            normalized=raw.replace(/\./g,"").replace(",",".");
          }else if(/^-?\d+,\d+$/.test(raw)){
            normalized=raw.replace(",",".");
          }else{
            normalized=raw.replace(/\s+/g,"");
          }

          const number=Number(normalized);
          if(Number.isFinite(number)){
            row[col]=number;
            converted++;
          }
        });

        state.data=normalizeRows([header,...rows]);
        addHistory(`Chuyển ${converted} ô Text → Number trong cột ${getHeaders()[col]}.`);
      }

      if(activeTool === "deletecol"){
        const col=Number($("deleteColumn").value);
        const oldName=getHeaders()[col];

        if(header.length <= 1) throw new Error("Cannot delete last column");

        header.splice(col,1);
        rows.forEach(row=>row.splice(col,1));

        state.data=normalizeRows([header,...rows]);
        addHistory(`Xóa cột ${oldName}.`);
      }

      updateWorkbookSheet();
      renderPreview();
      populateColumns();
      downloadBtn.disabled=false;
      success("Xử lý xong. Kiểm tra bảng xem trước rồi tải file kết quả.");
    }catch(e){
      console.error(e);
      /* Không giữ snapshot nếu thao tác thất bại */
      if(state.undoStack.length){
        state.undoStack.pop();
        if(undoBtn) undoBtn.disabled = state.undoStack.length === 0;
      }
      error("Không thể xử lý thao tác này. Hãy kiểm tra cột và dữ liệu.");
    }
  }

  async function readFile(file){
    if(typeof XLSX === "undefined"){
      error("Thư viện đọc Excel chưa tải được. Hãy kiểm tra Internet.");
      return;
    }

    if(!file || !/\.(xlsx|xls)$/i.test(file.name)){
      error("Chỉ hỗ trợ file Excel .xlsx hoặc .xls.");
      return;
    }

    state.fileSizeBytes=file.size || 0;

    if(state.fileSizeBytes > 35*1024*1024){
      const ok=window.confirm(
        `File có dung lượng ${formatBytes(state.fileSizeBytes)}. Trên điện thoại file quá lớn có thể làm trình duyệt thiếu RAM. Bạn vẫn muốn tiếp tục?`
      );
      if(!ok){
        fileInput.value="";
        return;
      }
    }

    return withProcessing(
      "Đang đọc file Excel...",
      state.fileSizeBytes >= PERF_THRESHOLDS.mediumBytes
        ? "File khá lớn. Quá trình đọc có thể mất vài giây."
        : "Vui lòng giữ trang này mở.",
      async ()=>{
        try{
          const buffer = await file.arrayBuffer();
          await nextFrame();

          const workbook = XLSX.read(buffer,{
            type:"array",
            cellDates:true,
            dense:true
          });

          if(!workbook?.SheetNames?.length){
            throw new Error("Workbook has no sheets");
          }

          state.workbook = workbook;
          state.originalName=file.name;
          state.history=[];
          state.undoStack=[];
          state.mergeFiles=[];
          state.smartCleanReport=null;
          state.errorScanReport=null;
          state.chartPreview=null;

          if(undoBtn) undoBtn.disabled=true;

          sheetSelect.innerHTML=state.workbook.SheetNames.map(name =>
            `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`
          ).join("");

          sheetSelect.disabled=false;
          processBtn.disabled=false;
          resetBtn.disabled=false;
          downloadBtn.disabled=false;
          shareBtn.disabled=false;

          $("mobileFileInfo").hidden=false;
          $("mobileFileInfo").textContent=
            `📄 ${file.name} · ${state.workbook.SheetNames.length} Sheet`;

          loadSheet(state.workbook.SheetNames[0]);
          updateProcessLoginState();

          if(!state.data.length){
            throw new Error("First sheet is empty");
          }

          renderHistory();
          success("Đọc file thành công.");
        }catch(e){
          console.error(e);

          state.workbook=null;
          state.data=[];
          state.fileSizeBytes=0;
          sheetSelect.innerHTML="";
          sheetSelect.disabled=true;
          processBtn.disabled=true;
          downloadBtn.disabled=true;
          shareBtn.disabled=true;

          const bar=$("mobilePerformanceBar");
          if(bar) bar.hidden=true;

          throw e;
        }
      }
    ).catch(e=>{
      console.error(e);
      error(
        e?.message==="First sheet is empty"
          ? "Sheet đầu tiên đang trống. Hãy kiểm tra lại file."
          : "Không đọc được file. File có thể bị hỏng, quá lớn hoặc không đúng định dạng Excel."
      );
    });
  }

  function reset(){
    state.workbook=null;
    state.originalName="";
    state.sheetName="";
    state.data=[];
    state.history=[];
    state.undoStack=[];
    fileInput.value="";
    sheetSelect.innerHTML="";
    sheetSelect.disabled=true;
    processBtn.disabled=true;
    if(undoBtn) undoBtn.disabled=true;
    downloadBtn.disabled=true;
    shareBtn.disabled=true;
    resetBtn.disabled=true;
    $("mobileFileInfo").hidden=true;
    message.textContent="";
    renderPreview();
    renderHistory();
  }

  function buildResultFile(){
    if(!state.workbook) return null;
    updateWorkbookSheet();
    const base=(state.originalName || "excel").replace(/\.(xlsx|xls)$/i,"");
    const filename=`${base}-processed.xlsx`;
    const array=XLSX.write(state.workbook,{
      bookType:"xlsx",
      type:"array",
      compression:true
    });
    return new File(
      [array],
      filename,
      {type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
    );
  }

  function download(){
    const file=buildResultFile();
    if(!file) return;

    const url=URL.createObjectURL(file);
    const a=document.createElement("a");
    a.href=url;
    a.download=file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);

    addHistory("Tải file Excel kết quả.");
  }

  async function shareResult(){
    const file=buildResultFile();
    if(!file) return;

    try{
      if(
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({files:[file]})
      ){
        await navigator.share({
          title:"File Excel đã xử lý",
          text:"File được xử lý bằng Excel Mobile Processor.",
          files:[file]
        });
        addHistory("Chia sẻ file Excel kết quả.");
      }else{
        error("Thiết bị/trình duyệt này chưa hỗ trợ chia sẻ file. Hãy dùng nút Tải Excel kết quả.");
      }
    }catch(e){
      if(e?.name !== "AbortError"){
        console.error(e);
        error("Không thể mở bảng chia sẻ trên thiết bị này.");
      }
    }
  }


  const toolsGrid = document.querySelector(".mobile-tools-grid");
  const toolsToggle = $("mobileToolsToggle");
  const toolSearch = $("mobileToolSearch");
  const toolSearchClear = $("mobileToolSearchClear");

  function debounce(fn,wait=180){
    let timer;
    return (...args)=>{
      clearTimeout(timer);
      timer=setTimeout(()=>fn(...args),wait);
    };
  }

  function normalizeSearchText(value){
    return String(value || "")
      .toLocaleLowerCase("vi-VN")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/đ/g,"d");
  }

  function setToolsExpanded(expanded){
    if(!toolsGrid || !toolsToggle) return;

    toolsGrid.classList.toggle("tools-expanded", expanded);
    toolsToggle.setAttribute("aria-expanded", String(expanded));
    toolsToggle.innerHTML = expanded
      ? "▲ Thu gọn tính năng"
      : "📚 Xem tất cả tính năng";

    if(expanded){
      filterTools();
    }else{
      toolsGrid.classList.remove("tools-category-filtering");
    }
  }

  function filterTools(){
    if(!toolsGrid || !toolSearch) return;

    const query = normalizeSearchText(toolSearch.value.trim());
    const buttons = [...toolsGrid.querySelectorAll(".mobile-tool")];
    const categoryFiltering = activeToolCategory !== "all";

    toolsGrid.classList.toggle("tools-category-filtering", categoryFiltering);

    buttons.forEach(btn=>{
      const categoryMatch =
        !categoryFiltering ||
        btn.dataset.category === activeToolCategory;

      btn.classList.toggle("tool-category-match", categoryMatch);
    });

    if(!query){
      toolsGrid.classList.remove("tools-searching");
      buttons.forEach(btn => btn.classList.remove("tool-search-match"));
      toolsToggle?.classList.remove("hidden");
      toolSearchClear?.classList.remove("show");

      /*
        Ở trạng thái mặc định "Quan trọng", vẫn giữ đúng yêu cầu:
        chỉ 4 công cụ đầu tiên. Chỉ lọc theo nhóm khi đã mở Xem tất cả.
      */
      if(!toolsGrid.classList.contains("tools-expanded")){
        toolsGrid.classList.remove("tools-category-filtering");
      }
      return;
    }

    toolsGrid.classList.add("tools-searching");
    toolsToggle?.classList.add("hidden");
    toolSearchClear?.classList.add("show");

    let firstMatch = null;

    buttons.forEach(btn=>{
      const haystack = normalizeSearchText(
        `${btn.dataset.tool || ""} ${btn.textContent || ""}`
      );
      const searchMatch = haystack.includes(query);
      btn.classList.toggle("tool-search-match", searchMatch);

      const categoryMatch =
        activeToolCategory === "all" ||
        btn.dataset.category === activeToolCategory;

      if(searchMatch && categoryMatch && !firstMatch){
        firstMatch = btn;
      }
    });

    const activeBtn = toolsGrid.querySelector(".mobile-tool.active");
    const activeMatches =
      activeBtn &&
      activeBtn.classList.contains("tool-search-match") &&
      (
        activeToolCategory === "all" ||
        activeBtn.dataset.category === activeToolCategory
      );

    if(firstMatch && !activeMatches){
      firstMatch.click();
    }
  }

  if(toolsToggle){
    setToolsExpanded(false);

    toolsToggle.addEventListener("click",()=>{
      const expanded = toolsToggle.getAttribute("aria-expanded") === "true";
      setToolsExpanded(!expanded);
    });
  }

  toolSearch?.addEventListener("input",debounce(filterTools,120));

  toolSearchClear?.addEventListener("click",()=>{
    toolSearch.value="";
    filterTools();
    toolSearch.focus();
  });

  $("mobileLoginRequiredClose")?.addEventListener("click",hideLoginRequired);
  $("mobileLoginRequiredCancel")?.addEventListener("click",hideLoginRequired);

  document.querySelectorAll("[data-login-close]").forEach(el=>{
    el.addEventListener("click",hideLoginRequired);
  });

  document.addEventListener("keydown",event=>{
    if(event.key==="Escape" && !$("mobileLoginRequired")?.hidden){
      hideLoginRequired();
    }
  });

  /*
    Đồng bộ trạng thái nút khi người dùng đăng nhập/đăng xuất ở cùng trang.
  */
  (async ()=>{
    const client=await waitForSupabaseClient();
    await getAuthenticatedUser();

    client?.auth?.onAuthStateChange?.((_event,session)=>{
      state.authChecked=true;
      state.currentUser=session?.user || null;
      updateProcessLoginState();

      if(state.currentUser){
        hideLoginRequired();
      }
    });
  })();

  document.querySelectorAll(".mobile-tool-category").forEach(btn=>{
    btn.addEventListener("click",()=>{
      activeToolCategory=btn.dataset.toolCategory || "all";

      document.querySelectorAll(".mobile-tool-category").forEach(x=>{
        x.classList.toggle("active",x===btn);
      });

      /*
        Khi chọn nhóm khác "Quan trọng", tự mở danh sách đầy đủ.
      */
      if(activeToolCategory !== "all" && !toolsGrid.classList.contains("tools-expanded")){
        setToolsExpanded(true);
      }

      filterTools();
    });
  });

  document.querySelectorAll(".mobile-tool").forEach(btn=>{
    btn.addEventListener("click",()=>{
      activeTool=btn.dataset.tool;
      document.querySelectorAll(".mobile-tool").forEach(x=>x.classList.toggle("active",x===btn));
      document.querySelectorAll(".tool-settings-panel").forEach(x=>x.classList.remove("active"));
      $(toolPanels[activeTool])?.classList.add("active");
      message.textContent="";
    });
  });


  /* ===== Auto Report / Pivot / Preview event bindings ===== */
  document.querySelectorAll(".report-preset").forEach(btn=>{
    btn.addEventListener("click",()=>{
      applyReportPresetUI(btn.dataset.reportPreset);
    });
  });

  $("reportAutoDetectBtn")?.addEventListener("click",()=>{
    autoDetectReportColumns();

    if(state.data.length){
      try{
        const report=buildReportData();
        state.reportPreview=report;
        renderReportPreview(report);
      }catch(e){}
    }
  });

  $("reportSheetName")?.addEventListener("input",()=>{
    $("reportSheetName").dataset.userEdited="1";
  });

  [
    "reportDateColumn",
    "reportGroupColumn",
    "reportValueColumn",
    "reportSecondaryColumn",
    "reportTopN"
  ].forEach(id=>{
    $(id)?.addEventListener("change",()=>{
      if(activeTool==="autoreport" && state.data.length){
        try{
          const report=buildReportData();
          state.reportPreview=report;
          renderReportPreview(report);
        }catch(e){}
      }
    });
  });

  [
    "pivotGroupColumn",
    "pivotSecondGroupColumn",
    "pivotValueColumn",
    "pivotAggregation",
    "pivotSort",
    "pivotTopN"
  ].forEach(id=>{
    $(id)?.addEventListener("change",()=>{
      if(activeTool==="quickpivot" && state.data.length){
        try{
          const pivot=buildQuickPivot();
          state.pivotPreview=pivot;
          renderQuickPivotPreview(pivot);
        }catch(e){}
      }
    });
  });

  $("batchSelectAll")?.addEventListener("click",()=>{
    document.querySelectorAll(".batch-column-checkbox").forEach(cb=>{
      cb.checked=true;
    });
    updateBatchSelectedCount();
  });

  $("batchClearAll")?.addEventListener("click",()=>{
    document.querySelectorAll(".batch-column-checkbox").forEach(cb=>{
      cb.checked=false;
    });
    updateBatchSelectedCount();
  });

  $("batchColumnAction")?.addEventListener("change",()=>{
    const warning=$("batchDeleteWarning");
    if(warning){
      warning.hidden=$("batchColumnAction").value!=="delete";
    }
  });

  const handleDataSearch=debounce(()=>{
    state.previewSearch=$("mobileDataSearch")?.value || "";
    const clear=$("mobileDataSearchClear");
    clear?.classList.toggle("show",Boolean(state.previewSearch.trim()));
    renderPreview();
  }, state.performanceMode ? 320 : 180);

  $("mobileDataSearch")?.addEventListener("input",handleDataSearch);

  $("mobileDataSearchClear")?.addEventListener("click",()=>{
    const input=$("mobileDataSearch");
    if(input) input.value="";
    state.previewSearch="";
    $("mobileDataSearchClear")?.classList.remove("show");
    renderPreview();
    input?.focus();
  });

  $("mobilePreviewTable")?.addEventListener("click",event=>{
    const cell=event.target.closest("td.mobile-editable-cell");
    if(!cell) return;

    const rowIndex=Number(cell.dataset.rowIndex);
    const colIndex=Number(cell.dataset.colIndex);

    if(Number.isInteger(rowIndex) && Number.isInteger(colIndex)){
      openCellEditor(rowIndex,colIndex);
    }
  });

  $("mobileCellSave")?.addEventListener("click",saveCellEdit);
  $("mobileCellCancel")?.addEventListener("click",closeCellEditor);
  $("mobileCellEditorClose")?.addEventListener("click",closeCellEditor);
  $("mobileCellDeleteRow")?.addEventListener("click",deleteEditingRow);

  document.querySelectorAll("[data-editor-close]").forEach(el=>{
    el.addEventListener("click",closeCellEditor);
  });

  document.addEventListener("keydown",event=>{
    if(event.key==="Escape" && !$("mobileCellEditor")?.hidden){
      closeCellEditor();
    }
  });

  $("dateToolMode")?.addEventListener("change",()=>{
    const diff = $("dateToolMode").value === "diff";
    const wrap = $("dateSecondColumnWrap");
    if(wrap) wrap.hidden = !diff;
  });

  $("errorScanBtn")?.addEventListener("click", scanErrorIssues);

  ["chartType","chartLabelColumn","chartValueColumn","chartTopN"].forEach(id=>{
    $(id)?.addEventListener("change",()=>{
      if(activeTool === "quickchart" && state.data.length){
        try{ renderQuickChartPreview(buildQuickChartData()); }catch(e){}
      }
    });
  });

  $("workflowSelectAllCols")?.addEventListener("click",()=>{
    document.querySelectorAll('.workflow-column-checkbox').forEach(cb=>cb.checked=true);
  });
  $("workflowClearCols")?.addEventListener("click",()=>{
    document.querySelectorAll('.workflow-column-checkbox').forEach(cb=>cb.checked=false);
  });
  $("workflowSaveBtn")?.addEventListener("click",()=>{
    try{ saveCurrentWorkflow(); }catch(e){ console.error(e); error("Hãy nhập tên workflow trước khi lưu."); }
  });
  $("workflowDeleteBtn")?.addEventListener("click",()=>{
    try{ deleteCurrentWorkflow(); }catch(e){ console.error(e); error("Hãy chọn workflow cần xóa."); }
  });
  $("workflowSavedList")?.addEventListener("change",()=>{
    const name = $("workflowSavedList").value;
    const item = loadSavedWorkflows().find(x=>x.name===name);
    if(item) fillWorkflowForm(item);
  });
  $("workflowRunBtn")?.addEventListener("click",()=>{
    try{
      const cfg = $("workflowSavedList")?.value ? (loadSavedWorkflows().find(x=>x.name===$("workflowSavedList").value) || collectWorkflowConfig()) : collectWorkflowConfig();
      if(!state.data.length){ error("Hãy upload file trước."); return; }
      pushUndoSnapshot();

      window.avpAnalytics?.track("excel_tool_used",{
        page:"excel-mobile.html",
        tool_name:"workflows"
      });

      runWorkflowConfig(cfg);
      updateWorkbookSheet();
      renderPreview();
      populateColumns();
      populateLookupSheets();
      renderBatchColumns();
      populatePivotSecondGroup();
      renderWorkflowColumns(cfg.columns || []);
      downloadBtn.disabled=false; shareBtn.disabled=false;
      success(`Đã chạy workflow "${cfg.name || 'Không tên'}".`);
    }catch(e){
      console.error(e);
      if(state.undoStack.length){ state.undoStack.pop(); if(undoBtn) undoBtn.disabled = state.undoStack.length===0; }
      error("Không thể chạy workflow. Hãy kiểm tra cấu hình và dữ liệu.");
    }
  });

  $("smartCleanScanBtn")?.addEventListener("click",scanSmartClean);

  $("mergeFilesInput")?.addEventListener("change",()=>{
    const files=$("mergeFilesInput").files;
    if(files?.length){
      loadMergeFiles(files).catch(e=>{
        console.error(e);
        error("Không đọc được một hoặc nhiều file đã chọn.");
      });
    }else{
      state.mergeFiles=[];
      renderMergeFilesInfo();
    }
  });

  $("mergeFilesSheetMode")?.addEventListener("change",()=>{
    const same=$("mergeFilesSheetMode").value==="same";
    const wrap=$("mergeFilesSheetNameWrap");
    if(wrap) wrap.hidden=!same;
  });

  fileInput.addEventListener("change",()=>{
    const file=fileInput.files?.[0];
    if(file) readFile(file).catch(e=>{
      console.error(e);
      error("Không đọc được file. Hãy thử file .xlsx/.xls khác.");
    });
  });

  sheetSelect.addEventListener("change",()=>{
    state.undoStack=[];
    if(undoBtn) undoBtn.disabled=true;
    loadSheet(sheetSelect.value);
  });
  processBtn.addEventListener("click",async ()=>{
    if(state.isProcessing) return;

    /*
      Người dùng được phép upload và preview file.
      Chỉ khi thực sự bắt đầu xử lý mới yêu cầu tài khoản.
    */
    const loggedIn=await ensureLoggedInForProcessing();
    if(!loggedIn) return;

    window.avpAnalytics?.track("excel_tool_used",{
      page:"excel-mobile.html",
      tool_name:activeTool,
      metadata:{performance_mode:Boolean(state.performanceMode)}
    });

    withProcessing(
      "Đang xử lý dữ liệu...",
      state.performanceMode
        ? "Performance Mode đang hoạt động để giảm tải cho điện thoại."
        : "Vui lòng chờ trong giây lát.",
      async ()=>{
        await nextFrame();
        runTool();
        await nextFrame();
        evaluatePerformanceMode();
      }
    );
  });
  undoBtn?.addEventListener("click",undoLastAction);
  downloadBtn.addEventListener("click",()=>{
    if(state.isProcessing) return;
    download();
  });
  shareBtn.addEventListener("click",()=>{
    if(state.isProcessing) return;
    shareResult();
  });
  $("lookupSheet")?.addEventListener("change",populateLookupColumns);
  resetBtn.addEventListener("click",reset);

  applyReportPresetUI("sales");
  renderBatchColumns();
  populatePivotSecondGroup();
  renderWorkflowColumns();
  renderWorkflowSavedList();
  renderPreview();
  renderHistory();
})();
