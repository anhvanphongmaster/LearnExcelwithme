from pathlib import Path

js_path=Path('admin-professional-track.js')
js=js_path.read_text(encoding='utf-8')
marker='// Pro metadata package import V1'
if marker not in js:
    anchor='  // Pro content coverage V1 — purely client-side, no extra Supabase queries.\n'
    assert anchor in js, 'coverage anchor missing'
    block=r'''  // Pro metadata package import V1 — fills the existing Case Builder only; never auto-publishes.
  async function importCaseMetadataFile(file){
    if(!file)return;
    if(file.size>256*1024)throw new Error("Metadata JSON vượt quá 256 KB.");
    let meta=null;
    try{meta=JSON.parse(await file.text())}catch(_){throw new Error("Metadata JSON không hợp lệ.")}
    if(!meta||typeof meta!=="object"||Array.isArray(meta))throw new Error("Metadata phải là một JSON object.");

    const domainKey=String(meta.domain_key||"").trim();
    const moduleIndex=Number(meta.module_index);
    const levelId=String(meta.level_id||"").trim();
    const caseIndex=Number(meta.case_index);
    const expectedKey=`${domainKey}-${moduleIndex}-${levelId}-${caseIndex}`;
    const caseKey=String(meta.case_key||"").trim();
    const tasks=Array.isArray(meta.tasks)?meta.tasks.map(v=>String(v||"").trim()).filter(Boolean):[];
    const validLevel=LEVELS.some(level=>level.id===levelId);
    if(!DOMAIN_MODULES[domainKey])throw new Error("domain_key không thuộc 8 lĩnh vực Pro hiện tại.");
    if(!Number.isInteger(moduleIndex)||moduleIndex<1||moduleIndex>DOMAIN_MODULES[domainKey].modules.length)throw new Error("module_index không hợp lệ.");
    if(!validLevel)throw new Error("level_id không hợp lệ.");
    if(![1,2,3].includes(caseIndex))throw new Error("case_index chỉ nhận 1, 2 hoặc 3.");
    if(caseKey!==expectedKey)throw new Error(`case_key phải là ${expectedKey}.`);
    if(!String(meta.title||"").trim())throw new Error("Metadata thiếu title.");
    if(!String(meta.goal||"").trim())throw new Error("Metadata thiếu goal.");
    if(!tasks.length)throw new Error("Metadata thiếu tasks.");
    if(meta.max_score!=null&&Number(meta.max_score)!==10)throw new Error("max_score của Pro phải bằng 10.");

    const existing=caseRows.get(caseKey)||null;
    if(existing)editCase(caseKey);else resetCaseForm();
    $("aptCaseDomain").value=domainKey;
    fillModuleOptions(String(moduleIndex));
    $("aptCaseModule").value=String(moduleIndex);
    $("aptCaseLevel").value=levelId;
    $("aptCaseIndex").value=String(caseIndex);
    $("aptCaseTitle").value=String(meta.title||"").trim();
    $("aptCaseGoal").value=String(meta.goal||"").trim();
    $("aptCaseTasks").value=tasks.join("\n");
    $("aptCaseSkills").value=String(meta.skills||"").trim();
    $("aptCaseOutput").value=String(meta.expected_output||"").trim();
    $("aptCaseDuration").value=String(meta.duration||"").trim();
    $("aptCaseScore").value="10";
    $("aptCaseSubmission").checked=meta.submission_enabled!==false;
    $("aptCasePublished").checked=false;
    if(!existing){
      setResourceState("source","");
      setResourceState("guide","");
      clearReferenceState(`Đã nạp metadata ${caseKey}. Case vẫn Draft; hãy chọn Student / Guide / Reference thật trước khi lưu/phát hành.`);
    }
    $("aptCaseForm").scrollIntoView({behavior:"smooth",block:"start"});
    await window.avpAlert(`Đã nạp ${caseKey}. Hệ thống luôn giữ “Phát hành” = OFF khi import metadata.`,{title:"Metadata đã nạp",tone:"success",icon:"✓"});
  }

'''
    js=js.replace(anchor,block+anchor,1)

    listener_anchor='    $("aptCaseReset")?.addEventListener("click",resetCaseForm);\n'
    assert listener_anchor in js, 'reset listener anchor missing'
    listener=r'''    $("aptCaseMetadataFile")?.addEventListener("change",async event=>{
      const input=event.currentTarget;
      try{await importCaseMetadataFile(input.files?.[0]||null)}catch(error){await window.avpAlert(String(error?.message||error),{title:"Không nạp được metadata",tone:"error",icon:"!"})}
      finally{input.value=""}
    });
'''
    js=js.replace(listener_anchor,listener_anchor+listener,1)
    js_path.write_text(js,encoding='utf-8')

html_path=Path('admin.html')
html=html_path.read_text(encoding='utf-8')
if 'aptCaseMetadataFile' not in html:
    anchor='<div class="apt-form-actions"><button type="submit" class="primary" id="aptCaseSave">Lưu Case</button><button type="button" id="aptCaseReset">Tạo / chọn Case khác</button></div>'
    assert anchor in html, 'form action anchor missing'
    repl='<div class="apt-form-actions"><label class="apt-metadata-import"><input id="aptCaseMetadataFile" type="file" accept=".json,application/json"><span>↥ Nạp metadata JSON</span></label><button type="submit" class="primary" id="aptCaseSave">Lưu Case</button><button type="button" id="aptCaseReset">Tạo / chọn Case khác</button></div>'
    html=html.replace(anchor,repl,1)
html=html.replace('admin-professional-track.css?v=20260909-pro-content1','admin-professional-track.css?v=20260909-pro-metadata1')
html=html.replace('admin-professional-track.js?v=20260909-pro-content1','admin-professional-track.js?v=20260909-pro-metadata1')
html_path.write_text(html,encoding='utf-8')

css_path=Path('admin-professional-track.css')
css=css_path.read_text(encoding='utf-8')
if '/* Pro metadata package import V1 */' not in css:
    css += r'''

/* Pro metadata package import V1 */
.apt-metadata-import{display:inline-flex;align-items:center;cursor:pointer}.apt-metadata-import input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}.apt-metadata-import span{display:inline-flex;align-items:center;justify-content:center;min-height:38px;padding:0 13px;border:1px solid #c7dbcf;border-radius:10px;background:#f5faf7;color:#245d3b;font-size:12px;font-weight:850}.apt-metadata-import:hover span{border-color:#7fae90;background:#eef7f1}
'''
    css_path.write_text(css,encoding='utf-8')
