(()=>{"use strict";
const $=id=>document.getElementById(id);let client=null,current=null,rows=[];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function getClient(){for(let i=0;i<80;i++){if(window.avpSupabase?.rpc)return window.avpSupabase;await new Promise(r=>setTimeout(r,75))}return null}
function notice(t,good=false){const n=$("avpcNotice");if(!n)return;n.hidden=!t;n.textContent=t;n.className="avpc-notice"+(good?" good":"")}
function label(s){return({idea:"Ý tưởng",selected:"Đã chọn",draft:"Đang làm",audit:"Chờ Audit",need_fix:"Cần sửa",pass:"PASS"}[s]||s)}
function render(list){rows=Array.isArray(list)?list:[];const box=$("avpcList");if(!box)return;box.innerHTML=rows.length?rows.map(r=>'<article class="avpc-card"><div><span>'+label(r.status)+'</span><h3>'+esc(r.title)+'</h3><p>'+esc(r.case_title||"Chưa có case")+'</p><small>'+esc(r.industry||"Chưa phân loại")+'</small></div><div><button type="button" data-edit="'+esc(r.id)+'">Mở</button> <button type="button" data-pass="'+esc(r.id)+'">PASS</button></div></article>').join(""):'<div class="avpc-empty">Chưa có content.</div>'}
function fill(r){current=r||null;$("avpcEditor").hidden=false;$("avpcEditorTitle").textContent=r?"Sửa content":"Video mới";$("avpcCode").value=r?.content_code||"";$("avpcCode").readOnly=!!r;$("avpcEditStatus").value=r?.status||"idea";$("avpcTitle").value=r?.title||"";$("avpcIndustry").value=r?.industry||"";$("avpcSkills").value=(r?.excel_skills||[]).join(", ");$("avpcCaseTitle").value=r?.case_title||"";$("avpcCaseDescription").value=r?.case_description||"";$("avpcHook").value=r?.hook||"";$("avpcScript").value=r?.script||"";$("avpcExcelLogic").value=r?.excel_logic||"";$("avpcFileName").value=r?.practice_file_name||"";$("avpcTikTok").value=r?.tiktok_url||""}
async function load(){client=client||await getClient();if(!client){notice("Supabase chưa sẵn sàng.");return}const [d,l]=await Promise.all([client.rpc("avp_content_dashboard_v1"),client.rpc("avp_content_list_v1",{p_search:$("avpcSearch").value.trim()||null,p_status:$("avpcStatus").value||null})]);if(d.error||l.error){notice("Content OS database chưa được cài.");return}const x=d.data||{};$("avpcIdea").textContent=x.idea||0;$("avpcWorking").textContent=(+x.selected||0)+(+x.draft||0)+(+x.need_fix||0);$("avpcAudit").textContent=x.audit||0;$("avpcPass").textContent=x.pass||0;render(l.data)}
function makeCode(){const d=new Date();return "AVP-TK-"+d.toISOString().slice(0,10).replace(/-/g,"")+"-"+Math.random().toString(36).slice(2,6).toUpperCase()}
async function generate(){
 if(!client)client=await getClient();
 const industry=$("avpcIndustry").value.trim(),skills=$("avpcSkills").value.trim(),caseTitle=$("avpcCaseTitle").value.trim(),caseDescription=$("avpcCaseDescription").value.trim();
 if(!caseTitle&&!caseDescription){notice("Chưa có Case. Nhập tình huống thực tế rồi bấm AI tạo content.");$("avpcCaseTitle")?.focus();return}
 const btn=$("avpcAiGenerate");if(btn)btn.disabled=true;notice("AI đang dựng Hook, Voice script và Excel logic…");
 try{
  const {data:session,error:sessionErr}=await client.rpc("avp_ai_get_or_create_session");if(sessionErr)throw sessionErr;
  const sessionId=session?.id||session?.session_id||session;
  if(!sessionId)throw new Error("Không tạo được AI session.");
  const requestId=crypto?.randomUUID?.()||String(Date.now());
  const prompt=`Bạn là Content Engine của Anh Văn Phòng. Hãy tạo một video TikTok Excel thực chiến từ dữ liệu đầu vào sau.
Ngành/bối cảnh: ${industry||"chưa xác định"}
Excel skill: ${skills||"chưa xác định"}
Case: ${caseTitle||"chưa có"}
Mô tả case: ${caseDescription||"chưa có"}

Quy tắc bắt buộc:
- Nội dung thực tế, giải quyết một vấn đề công việc rõ ràng; không làm video kiểu mẹo Excel quá đơn giản.
- Voice xưng "anh", gọi người xem là "mấy đứa" hoặc "các vợ" tự nhiên; hơi láo nhẹ nhưng không chửi tục.
- Voice chỉ là lời đọc, không mô tả thao tác trên màn hình.
- Nếu có công thức Excel, phải viết công thức chính xác và đọc được bằng voice.
- Không dùng viết tắt khiến AI voice đọc sai.
- Hook phải có vấn đề cụ thể và tạo lý do xem tiếp.
- Script ngắn, thực dụng, nhất quán 100 phần trăm với case và Excel logic.
- Practice file name phải là tên file xlsx hợp lý, không cần tạo file thật.

Không giải thích. Trả về đúng 9 block theo format marker, không Markdown:
[TITLE]Tên video[/TITLE]
[INDUSTRY]Ngành/bối cảnh[/INDUSTRY]
[SKILLS]skill 1, skill 2[/SKILLS]
[CASE_TITLE]Tên case[/CASE_TITLE]
[CASE_DESCRIPTION]Mô tả case[/CASE_DESCRIPTION]
[HOOK]Hook[/HOOK]
[SCRIPT]Voice script[/SCRIPT]
[EXCEL_LOGIC]Excel logic và công thức[/EXCEL_LOGIC]
[PRACTICE_FILE]ten-file.xlsx[/PRACTICE_FILE]
Không thêm chữ trước [TITLE] hoặc sau [/PRACTICE_FILE].`;
  const {data,error}=await client.functions.invoke("ai-chat",{body:{session_id:sessionId,message:prompt,content:prompt,question:prompt,request_id:requestId}});
  if(error)throw error;
  const raw=String(data?.answer||data?.content||data?.message||data?.response||"").trim();
  const cleaned=raw.replace(/^\`\`\`(?:json)?\s*/i,"").replace(/\s*\`\`\`$/i,"").trim();
  let out=null;
  const startJson=cleaned.indexOf("{");
  const endJson=cleaned.lastIndexOf("}");
  if(startJson>=0&&endJson>startJson){try{out=JSON.parse(cleaned.slice(startJson,endJson+1));}catch{}}
  if(!out){
    const get=(name)=>{const m=cleaned.match(new RegExp("\\["+name+"\\]([\\s\\S]*?)\\[\\/"+name+"\\]","i"));return m?m[1].trim():"";};
    out={title:get("TITLE"),industry:get("INDUSTRY"),excel_skills:get("SKILLS").split(",").map(x=>x.trim()).filter(Boolean),case_title:get("CASE_TITLE"),case_description:get("CASE_DESCRIPTION"),hook:get("HOOK"),script:get("SCRIPT"),excel_logic:get("EXCEL_LOGIC"),practice_file_name:get("PRACTICE_FILE")};
  }
  if(!out.title&&!out.script&&!out.hook)throw new Error("AI không trả về nội dung theo format Content OS.");
  $("avpcCode").value=$("avpcCode").value.trim()||makeCode();
  $("avpcTitle").value=out.title||$("avpcTitle").value;
  $("avpcIndustry").value=out.industry||industry;
  $("avpcSkills").value=Array.isArray(out.excel_skills)?out.excel_skills.join(", "):skills;
  $("avpcCaseTitle").value=out.case_title||caseTitle;
  $("avpcCaseDescription").value=out.case_description||caseDescription;
  $("avpcHook").value=out.hook||"";
  $("avpcScript").value=out.script||"";
  $("avpcExcelLogic").value=out.excel_logic||"";
  $("avpcFileName").value=out.practice_file_name||"";
  $("avpcEditStatus").value="draft";
  notice("AI đã tạo nội dung. Kiểm tra lại rồi mới Lưu content.",true);
 }catch(err){console.error("Content OS AI",err);let detail="";try{const response=err?.context;if(response&&typeof response.json==="function"){const payload=await response.json();detail=payload?.provider_message||payload?.error||"";if(payload?.provider_status)detail="Mã "+payload.provider_status+": "+detail}}catch{}notice("AI chưa tạo được content"+(detail?": "+detail:": "+(err?.message||"lỗi không xác định")));}
 finally{if(btn)btn.disabled=false}
}
async function save(e){e.preventDefault();const p={id:current?.id||"",content_code:$("avpcCode").value.trim()||makeCode(),title:$("avpcTitle").value.trim(),status:$("avpcEditStatus").value,priority:"normal",channel:"tiktok",industry:$("avpcIndustry").value.trim(),excel_skills:$("avpcSkills").value.split(",").map(x=>x.trim()).filter(Boolean),case_title:$("avpcCaseTitle").value.trim(),case_description:$("avpcCaseDescription").value,hook:$("avpcHook").value,script:$("avpcScript").value,excel_logic:$("avpcExcelLogic").value,practice_file_name:$("avpcFileName").value.trim(),tiktok_url:$("avpcTikTok").value.trim()||null};const r=await client.rpc("avp_content_save_v1",{p_content:p});if(r.error){notice(r.error.message);return}notice("Đã lưu content.",true);$("avpcEditor").hidden=true;await load()}
async function audit(){if(!current?.id)return;const r=await client.rpc("avp_content_audit_v1",{p_content_id:current.id,p_result:"pass",p_issues:[],p_suggestions:[]});if(r.error){notice(r.error.message);return}notice("Đã PASS content.",true);await load()}
async function del(){if(!current?.id||!confirm("Xóa content này?"))return;const r=await client.rpc("avp_content_delete_v1",{p_id:current.id});if(r.error){notice(r.error.message);return}current=null;$("avpcEditor").hidden=true;await load()}
function boot(){if(!$("avpContentPanel"))return;$("avpcReload").onclick=load;$("avpcAiGenerate").onclick=generate;$("avpcNew").onclick=()=>fill(null);$("avpcClose").onclick=()=>$("avpcEditor").hidden=true;$("avpcEditor").onsubmit=save;$("avpcAudit").onclick=audit;$("avpcDelete").onclick=del;$("avpcSearch").onchange=load;$("avpcStatus").onchange=load;$("avpcList").onclick=e=>{const b=e.target.closest("button");if(!b)return;const r=rows.find(x=>x.id===b.dataset.edit||x.id===b.dataset.pass);if(!r)return;if(b.dataset.edit)fill(r);else{current=r;audit()}};window.addEventListener("avp:admin-content-open",load);load()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot()})();