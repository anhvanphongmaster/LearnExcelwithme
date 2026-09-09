import { createClient } from 'npm:@supabase/supabase-js@2';
import * as XLSX from 'npm:xlsx@0.18.5';

const H = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
};
const SUBMISSIONS='professional-track-submissions';
const GRADING='professional-track-grading';
const VERSION='AVP_PRO_GRADER_V3';
const RUBRIC_MARKER='AVP_PRO_GRADER_V1';
const MAX_SUBMISSION=15*1024*1024;
const MAX_REFERENCE=20*1024*1024;

type Rule={type:string;sheet?:string;range?:string;points?:number;label?:string;tolerance?:number;functions?:string[]};
type Rubric={case_key?:string;pass_score?:number;rules?:Rule[]};
type TestMode='normal'|'simulate-pass'|'simulate-hardcode'|'simulate-wrong';
type RR={type:string;label:string;category:string;points:number;earned:number;pass:boolean;reason?:string};

const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:H});
const env=(...keys:string[])=>{for(const k of keys){const v=Deno.env.get(k);if(v)return v}return ''};
const envJson=(name:string)=>{try{const o=JSON.parse(Deno.env.get(name)||'{}');return String(o.default||Object.values(o)[0]||'')}catch{return ''}};
const publicKey=()=>env('SUPABASE_ANON_KEY','SUPABASE_PUBLISHABLE_KEY')||envJson('SUPABASE_PUBLISHABLE_KEYS');
const secretKey=()=>env('SUPABASE_SERVICE_ROLE_KEY','SUPABASE_SECRET_KEY')||envJson('SUPABASE_SECRET_KEYS');
const err=(e:unknown)=>e instanceof Error?e.message:String(e||'unknown_error');
const ext=(s:string)=>(String(s||'').toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]||'');
const supported=(s:string)=>['xlsx','xlsm'].includes(ext(s));
const val=(v:unknown)=>v==null?null:typeof v==='number'?(Number.isFinite(v)?v:null):typeof v==='boolean'?v:String(v).trim();
const eq=(a:unknown,b:unknown,t=0)=>typeof val(a)==='number'&&typeof val(b)==='number'?Math.abs(Number(val(a))-Number(val(b)))<=Math.max(0,Number(t)||0):val(a)===val(b);
const formula=(v:unknown)=>String(v||'').replace(/^=/,'').replace(/\s+/g,'').toUpperCase();
const nonempty=(c:XLSX.CellObject|undefined)=>!!c&&(!!c.f||(c.v!=null&&(typeof c.v!=='string'||c.v.trim()!=='')));
const excelError=(c:XLSX.CellObject|undefined)=>!!c&&(c.t==='e'||(typeof c.v==='string'&&['#N/A','#VALUE!','#REF!','#DIV/0!','#NAME?','#NUM!','#NULL!','#SPILL!','#CALC!'].includes(c.v.trim().toUpperCase())));
const category=(t:string)=>t==='formula_range'?'formula':t==='compare_range'?'accuracy':t==='no_errors'?'errors':'structure';
const catLabel=(k:string)=>({structure:'Cấu trúc dữ liệu',formula:'Công thức',accuracy:'Tính chính xác',errors:'Kiểm soát lỗi'} as Record<string,string>)[k]||k;

function rangeCells(ws:XLSX.WorkSheet,range:string){
  const d=XLSX.utils.decode_range(range),out:{address:string;cell:XLSX.CellObject|undefined}[]=[];
  for(let r=d.s.r;r<=d.e.r;r++)for(let c=d.s.c;c<=d.e.c;c++){const address=XLSX.utils.encode_cell({r,c});out.push({address,cell:ws[address] as XLSX.CellObject|undefined})}
  return out;
}
function rubricOf(ref:XLSX.WorkBook,key:string):Rubric{
  const ws=ref.Sheets['_AVP_GRADER']; if(!ws)throw new Error('rubric_sheet_missing');
  if(String(ws.A1?.v||'').trim()!==RUBRIC_MARKER)throw new Error('rubric_version_unsupported');
  let r:Rubric; try{r=JSON.parse(String(ws.A2?.v||''))}catch{throw new Error('rubric_json_invalid')}
  if(r.case_key!==key)throw new Error('rubric_case_mismatch');
  if(!Array.isArray(r.rules)||!r.rules.length)throw new Error('rubric_rules_missing');
  const total=r.rules.reduce((s,x)=>s+Math.max(0,Number(x.points)||0),0); if(Math.abs(total-10)>.0001)throw new Error('rubric_points_must_equal_10');
  return r;
}
function assertReferenceReady(reference:XLSX.WorkBook,rubric:Rubric){
  for(const rule of rubric.rules||[]){
    if(rule.type!=='formula_range')continue;
    const sheet=String(rule.sheet||''),ws=reference.Sheets[sheet];
    if(!ws||!rule.range)throw new Error(`reference_rule_invalid:${String(rule.label||rule.type)}`);
    for(const {address,cell} of rangeCells(ws,rule.range)){
      if(!formula(cell?.f))throw new Error(`reference_formula_missing:${sheet}!${address}`);
    }
  }
}
function grade(candidate:XLSX.WorkBook,reference:XLSX.WorkBook,rubric:Rubric,mode:TestMode='normal'){
  const results:RR[]=[];
  for(const rule of rubric.rules||[]){
    const points=Math.max(0,Number(rule.points)||0),label=String(rule.label||rule.type||'Kiểm tra'),cat=category(rule.type);
    const pass=():RR=>({type:rule.type,label,category:cat,points,earned:points,pass:true});
    const fail=(reason:string):RR=>({type:rule.type,label,category:cat,points,earned:0,pass:false,reason});
    const sheet=String(rule.sheet||''),cw=candidate.Sheets[sheet],rw=reference.Sheets[sheet]; let rr:RR;
    if(rule.type==='required_sheet') rr=cw?pass():fail('Thiếu sheet bắt buộc');
    else if(!cw) rr=fail('Thiếu sheet cần kiểm tra');
    else if(rule.type==='compare_range'){
      if(!rw||!rule.range)throw new Error(`reference_rule_invalid:${label}`);
      if(mode==='simulate-wrong'){rr=fail('Giả lập kết quả sai');results.push(rr);continue}
      const a=rangeCells(cw,rule.range),b=rangeCells(rw,rule.range);let ok=true;
      for(let i=0;i<a.length;i++)if(!eq(a[i].cell?.v,b[i].cell?.v,Number(rule.tolerance)||0)){ok=false;break}
      rr=ok?pass():fail('Kết quả chưa khớp dữ liệu chuẩn');
    }else if(rule.type==='formula_range'){
      if(!rw||!rule.range)throw new Error(`reference_rule_invalid:${label}`);
      if(mode==='simulate-pass'){rr=pass();results.push(rr);continue}
      if(mode==='simulate-hardcode'||mode==='simulate-wrong'){rr=fail(mode==='simulate-hardcode'?'Giả lập hardcode':'Giả lập công thức sai');results.push(rr);continue}
      const a=rangeCells(cw,rule.range),b=rangeCells(rw,rule.range);let ok=true;
      for(let i=0;i<a.length;i++){
        const actual=formula(a[i].cell?.f),expected=formula(b[i].cell?.f);
        if(!actual){ok=false;break}
        if(expected&&actual!==expected){ok=false;break}
        for(const fn of rule.functions||[])if(!actual.includes(`${String(fn).toUpperCase()}(`)){ok=false;break}
        if(!ok)break;
      }
      rr=ok?pass():fail('Công thức chưa đạt yêu cầu');
    }else if(rule.type==='no_errors'){
      if(!rule.range)throw new Error(`reference_rule_invalid:${label}`);
      rr=rangeCells(cw,rule.range).some(x=>excelError(x.cell))?fail('Còn lỗi Excel trong vùng kết quả'):pass();
    }else if(rule.type==='nonempty_range'){
      if(!rule.range)throw new Error(`reference_rule_invalid:${label}`);
      rr=rangeCells(cw,rule.range).every(x=>nonempty(x.cell))?pass():fail('Còn ô bắt buộc chưa hoàn thiện');
    }else throw new Error(`unsupported_rule:${rule.type}`);
    results.push(rr);
  }
  const score=Math.round(results.reduce((s,r)=>s+r.earned,0)*100)/100,max=Math.round(results.reduce((s,r)=>s+r.points,0)*100)/100;
  const categories=['structure','formula','accuracy','errors'].map(k=>{const rows=results.filter(r=>r.category===k);if(!rows.length)return null;const earned=Math.round(rows.reduce((s,r)=>s+r.earned,0)*100)/100,m=Math.round(rows.reduce((s,r)=>s+r.points,0)*100)/100;return{key:k,label:catLabel(k),earned,max:m,pass:rows.every(r=>r.pass)}}).filter(Boolean);
  const passScore=Number(rubric.pass_score)||7;
  return{score,max_score:max,pass:score>=passScore,pass_score:passScore,categories,rules:results};
}
function feedback(r:ReturnType<typeof grade>){
  const cats=r.categories.map((c:any)=>`${c.label}: ${c.pass?'PASS':'FAIL'} ${c.earned}/${c.max}`).join(' | '),failed=r.rules.filter(x=>!x.pass).slice(0,4).map(x=>x.label).join('; ');
  return `[AUTO PRO V3] ${cats} | Tổng: ${r.score}/${r.max_score}.${failed?` | Cần sửa: ${failed}`:' | Tất cả tiêu chí tự động đều đạt.'}`.slice(0,1200);
}
const review=(reason:string)=>`[AUTO REVIEW] Auto-Grader chưa đủ điều kiện kết luận (${String(reason||'grader_uncertain').replace(/[\r\n|]+/g,' ').slice(0,300)}). Admin sẽ chỉ kiểm tra trường hợp ngoại lệ này.`;
async function workbook(blob:Blob){return XLSX.read(new Uint8Array(await blob.arrayBuffer()),{type:'array',cellFormula:true,cellDates:false,cellNF:true,cellText:false})}
async function referenceStamp(admin:any,key:string){
  const {data,error}=await admin.storage.from(GRADING).list(key,{limit:20});
  if(error)throw error;
  const row=(Array.isArray(data)?data:[]).find((item:any)=>item.name==='reference.xlsx');
  if(!row)throw new Error('reference_missing');
  const stamp=String(row.updated_at||row.created_at||'');
  if(!stamp)throw new Error('reference_timestamp_missing');
  return stamp;
}

Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response('ok',{headers:H});
  if(req.method!=='POST')return reply({error:'method_not_allowed'},405);
  const url=env('SUPABASE_URL'),pk=publicKey(),sk=secretKey(),auth=req.headers.get('Authorization')||'';
  if(!url||!pk||!sk)return reply({error:'grader_not_configured'},500); if(!auth.startsWith('Bearer '))return reply({error:'unauthorized'},401);
  const userClient=createClient(url,pk,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}}),token=auth.slice(7);
  const {data:ud,error:ue}=await userClient.auth.getUser(token),user=ud?.user;if(ue||!user)return reply({error:'unauthorized'},401);
  const {data:adminFlag}=await userClient.rpc('is_admin_user'),isAdmin=adminFlag===true;
  const admin=createClient(url,sk,{auth:{persistSession:false,autoRefreshToken:false}});
  let body:any={};try{body=await req.json()}catch{return reply({error:'invalid_json'},400)}
  const mode=String(body.mode||'grade'),key=String(body.case_key||'').trim();

  if(mode==='validate_reference'){
    if(!isAdmin)return reply({error:'admin_required'},403);if(!key)return reply({error:'case_key_required'},400);
    try{
      const stampBefore=await referenceStamp(admin,key);
      const {data:blob,error:e}=await admin.storage.from(GRADING).download(`${key}/reference.xlsx`);if(e||!blob)throw new Error('reference_missing');if(blob.size>MAX_REFERENCE)throw new Error('reference_too_large');
      const ref=await workbook(blob),rubric=rubricOf(ref,key);
      assertReferenceReady(ref,rubric);
      const p=grade(ref,ref,rubric,'simulate-pass'),h=grade(ref,ref,rubric,'simulate-hardcode'),w=grade(ref,ref,rubric,'simulate-wrong');
      const valid=p.score===10&&h.score<7&&w.score<7;if(!valid)return reply({status:'validation_failed',case_key:key,tests:{pass:p.score,hardcode:h.score,wrong_formula:w.score}});
      const stampAfter=await referenceStamp(admin,key);if(stampAfter!==stampBefore)throw new Error('reference_changed_during_validation');
      const marker={status:'validated',version:VERSION,case_key:key,reference_updated_at:stampAfter,validated_at:new Date().toISOString(),tests:{pass:p.score,hardcode:h.score,wrong_formula:w.score}};
      const saved=await admin.from('professional_track_cases_v2').update({grader_validation:marker}).eq('case_key',key).select('case_key').maybeSingle();
      if(saved.error)throw saved.error;if(!saved.data)throw new Error('case_not_saved_as_draft');
      return reply({status:'validated',case_key:key,validated_at:marker.validated_at,reference_updated_at:stampAfter,tests:marker.tests});
    }catch(e){return reply({status:'validation_failed',case_key:key,reason:err(e)})}
  }

  const id=String(body.submission_id||'').trim();if(!id)return reply({error:'submission_id_required'},400);
  const {data:s,error:se}=await admin.from('professional_track_case_submissions_v2').select('id,user_id,case_key,file_path,original_name').eq('id',id).maybeSingle();
  if(se||!s)return reply({error:'submission_not_found'},404);if(key&&key!==s.case_key)return reply({error:'case_mismatch'},400);if(!isAdmin&&s.user_id!==user.id)return reply({error:'forbidden'},403);
  const path=String(s.file_path||''),name=String(s.original_name||path),activeKey=String(s.case_key);
  const markReview=async(reason:string)=>{const f=review(reason);await admin.from('professional_track_case_submissions_v2').update({status:'pending',score:null,feedback:f,graded_at:null,reviewed_by:null}).eq('id',s.id).eq('file_path',path);return reply({status:'review_required',reason,case_key:activeKey})};
  if(!supported(name))return await markReview(`unsupported_file_type:${ext(name)||'unknown'}`);
  try{
    const [{data:caseRow,error:caseError},stamp]=await Promise.all([
      admin.from('professional_track_cases_v2').select('grader_validation').eq('case_key',activeKey).maybeSingle(),
      referenceStamp(admin,activeKey)
    ]);
    if(caseError||!caseRow)return await markReview('case_missing');
    const validation:any=caseRow.grader_validation||null;
    if(validation?.status!=='validated'||validation?.version!==VERSION||String(validation?.reference_updated_at||'')!==stamp)return await markReview('grader_validation_stale');
    const [{data:cb,error:ce},{data:rb,error:re}]=await Promise.all([admin.storage.from(SUBMISSIONS).download(path),admin.storage.from(GRADING).download(`${activeKey}/reference.xlsx`)]);
    if(ce||!cb)return await markReview('submission_file_missing');if(re||!rb)return await markReview('reference_missing');if(cb.size>MAX_SUBMISSION)return await markReview('submission_too_large');if(rb.size>MAX_REFERENCE)return await markReview('reference_too_large');
    const [cand,ref]=await Promise.all([workbook(cb),workbook(rb)]);
    const rubric=rubricOf(ref,activeKey);assertReferenceReady(ref,rubric);
    const r=grade(cand,ref,rubric,'normal'),f=feedback(r);
    const u=await admin.from('professional_track_case_submissions_v2').update({status:'graded',score:r.score,feedback:f,graded_at:new Date().toISOString(),reviewed_by:null}).eq('id',s.id).eq('file_path',path).select('id').maybeSingle();if(u.error||!u.data)throw new Error('submission_changed_during_grading');
    return reply({status:'graded',case_key:activeKey,score:r.score,max_score:r.max_score,pass:r.pass,categories:r.categories});
  }catch(e){return await markReview(err(e))}
});
