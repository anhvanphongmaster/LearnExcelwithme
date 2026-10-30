/* AVP Excel Formula Library — 200 curated practice examples.
   Each formula has a paired question. The four row/criteria variants create 200 distinct practice records.
   Formula syntax targets Excel 365 unless a note says otherwise. */
(function(){
'use strict';
const scenarios=[
 {r:2,e:100,code:'FPC-A01',model:'Model FPC-A01',field:'NG Qty',team:'QC1',month:'2026-10'},
 {r:3,e:250,code:'FPC-B02',model:'Model FPC-B02',field:'Input Qty',team:'QC2',month:'2026-09'},
 {r:4,e:500,code:'FPC-C03',model:'Model FPC-C03',field:'Doanh số',team:'Sales',month:'2026-08'},
 {r:5,e:1000,code:'FPC-D04',model:'Model FPC-D04',field:'Số lượng',team:'Kho',month:'2026-07'}
];
const patterns=[
// CƠ BẢN — 20 nhóm x 4 tình huống = 80
{n:'SUM',f:(r,e,c)=>`=SUM(E${r}:E${e})`,d:'Cộng toàn bộ giá trị trong một vùng.',task:'tính tổng số lượng trong cột dữ liệu',cat:'Cơ bản',opts:['SUM','AVERAGE','COUNT','MAX']},
{n:'AVERAGE',f:(r,e,c)=>`=AVERAGE(E${r}:E${e})`,d:'Tính giá trị trung bình của vùng.',task:'tính giá trị trung bình của dữ liệu',cat:'Cơ bản',opts:['AVERAGE','SUM','MIN','COUNTA']},
{n:'MIN',f:(r,e,c)=>`=MIN(E${r}:E${e})`,d:'Tìm giá trị nhỏ nhất trong vùng.',task:'tìm giá trị nhỏ nhất trong danh sách',cat:'Cơ bản',opts:['MIN','MAX','LARGE','SMALL']},
{n:'MAX',f:(r,e,c)=>`=MAX(E${r}:E${e})`,d:'Tìm giá trị lớn nhất trong vùng.',task:'tìm giá trị lớn nhất trong danh sách',cat:'Cơ bản',opts:['MAX','MIN','COUNT','RANK.EQ']},
{n:'COUNT',f:(r,e,c)=>`=COUNT(E${r}:E${e})`,d:'Đếm các ô chứa dữ liệu dạng số.',task:'đếm số ô có chứa giá trị số',cat:'Cơ bản',opts:['COUNT','COUNTA','COUNTBLANK','SUM']},
{n:'COUNTA',f:(r,e,c)=>`=COUNTA(B${r}:B${e})`,d:'Đếm các ô không trống, gồm cả chữ và số.',task:'đếm số dòng có mã hoặc nội dung',cat:'Cơ bản',opts:['COUNTA','COUNT','COUNTBLANK','SUM']},
{n:'COUNTBLANK',f:(r,e,c)=>`=COUNTBLANK(B${r}:B${e})`,d:'Đếm số ô trống trong vùng.',task:'kiểm tra có bao nhiêu ô đang bỏ trống',cat:'Cơ bản',opts:['COUNTBLANK','COUNTA','COUNTIF','COUNT']},
{n:'ROUND',f:(r,e,c)=>`=ROUND(E${r},2)`,d:'Làm tròn đến số chữ số thập phân chỉ định.',task:'làm tròn kết quả đến hai chữ số thập phân',cat:'Cơ bản',opts:['ROUND','ROUNDUP','ROUNDDOWN','INT']},
{n:'ROUNDUP',f:(r,e,c)=>`=ROUNDUP(E${r},0)`,d:'Luôn làm tròn ra xa số 0.',task:'làm tròn lên số nguyên gần nhất',cat:'Cơ bản',opts:['ROUNDUP','ROUNDDOWN','ROUND','TRUNC']},
{n:'ROUNDDOWN',f:(r,e,c)=>`=ROUNDDOWN(E${r},0)`,d:'Luôn làm tròn về phía 0.',task:'làm tròn xuống số nguyên gần nhất',cat:'Cơ bản',opts:['ROUNDDOWN','ROUNDUP','ROUND','INT']},
{n:'IF',f:(r,e,c)=>`=IF(E${r}>=100,"Đạt","Chưa đạt")`,d:'Trả về kết quả theo một điều kiện đúng hoặc sai.',task:'phân loại kết quả đạt hay chưa đạt theo ngưỡng',cat:'Cơ bản',opts:['IF','AND','OR','IFS']},
{n:'AND',f:(r,e,c)=>`=AND(E${r}>=95,F${r}="PASS")`,d:'Kiểm tra tất cả điều kiện có cùng đúng hay không.',task:'kiểm tra đồng thời nhiều điều kiện',cat:'Cơ bản',opts:['AND','OR','IFERROR','NOT']},
{n:'OR',f:(r,e,c)=>`=OR(F${r}="NG",G${r}="NG")`,d:'Kiểm tra có ít nhất một điều kiện đúng.',task:'kiểm tra chỉ cần một trong nhiều điều kiện đúng',cat:'Cơ bản',opts:['OR','AND','NOT','IF']},
{n:'LEFT',f:(r,e,c)=>`=LEFT(A${r},3)`,d:'Lấy ký tự từ bên trái chuỗi.',task:'lấy ba ký tự đầu của mã',cat:'Cơ bản',opts:['LEFT','RIGHT','MID','LEN']},
{n:'RIGHT',f:(r,e,c)=>`=RIGHT(A${r},4)`,d:'Lấy ký tự từ bên phải chuỗi.',task:'lấy bốn ký tự cuối của mã',cat:'Cơ bản',opts:['RIGHT','LEFT','MID','LEN']},
{n:'MID',f:(r,e,c)=>`=MID(A${r},4,3)`,d:'Lấy một phần chuỗi từ vị trí chỉ định.',task:'trích ký tự ở giữa mã theo vị trí',cat:'Cơ bản',opts:['MID','LEFT','RIGHT','FIND']},
{n:'LEN',f:(r,e,c)=>`=LEN(A${r})`,d:'Đếm tổng số ký tự trong chuỗi.',task:'đếm độ dài của mã hoặc nội dung',cat:'Cơ bản',opts:['LEN','TRIM','CLEAN','MID']},
{n:'TRIM',f:(r,e,c)=>`=TRIM(A${r})`,d:'Loại bỏ khoảng trắng thừa giữa các từ.',task:'loại bỏ khoảng trắng thừa trong dữ liệu chữ',cat:'Cơ bản',opts:['TRIM','CLEAN','SUBSTITUTE','PROPER']},
{n:'UPPER',f:(r,e,c)=>`=UPPER(A${r})`,d:'Chuyển toàn bộ chữ thành chữ in hoa.',task:'chuyển mã hoặc tên thành chữ in hoa',cat:'Cơ bản',opts:['UPPER','LOWER','PROPER','TRIM']},
{n:'LOWER',f:(r,e,c)=>`=LOWER(A${r})`,d:'Chuyển toàn bộ chữ thành chữ thường.',task:'chuyển nội dung thành chữ thường',cat:'Cơ bản',opts:['LOWER','UPPER','PROPER','CLEAN']},
// NÂNG CAO — 20 nhóm x 4 = 80
{n:'SUMIF',f:(r,e,c)=>`=SUMIF(B${r}:B${e}," ${c}",E${r}:E${e})`.replace('" ','"'),d:'Tính tổng theo một điều kiện.',task:'tính tổng theo một mã Model cụ thể',cat:'Nâng cao',opts:['SUMIF','COUNTIF','SUMIFS','AVERAGEIF']},
{n:'SUMIFS',f:(r,e,c)=>`=SUMIFS(E${r}:E${e},B${r}:B${e},"${c}",C${r}:C${e},"PASS")`,d:'Tính tổng theo nhiều điều kiện đồng thời.',task:'tính tổng khi Model và trạng thái cùng thỏa mãn',cat:'Nâng cao',opts:['SUMIFS','SUMIF','COUNTIFS','AVERAGEIFS']},
{n:'COUNTIF',f:(r,e,c)=>`=COUNTIF(B${r}:B${e},"${c}")`,d:'Đếm số ô thỏa mãn một điều kiện.',task:'đếm số dòng thuộc một Model',cat:'Nâng cao',opts:['COUNTIF','SUMIF','COUNTIFS','COUNTA']},
{n:'COUNTIFS',f:(r,e,c)=>`=COUNTIFS(B${r}:B${e},"${c}",F${r}:F${e},"NG")`,d:'Đếm số dòng thỏa mãn nhiều điều kiện.',task:'đếm số lỗi NG của một Model',cat:'Nâng cao',opts:['COUNTIFS','COUNTIF','SUMIFS','AVERAGEIFS']},
{n:'AVERAGEIF',f:(r,e,c)=>`=AVERAGEIF(B${r}:B${e},"${c}",E${r}:E${e})`,d:'Tính trung bình theo một điều kiện.',task:'tính trung bình số lượng của một Model',cat:'Nâng cao',opts:['AVERAGEIF','AVERAGEIFS','SUMIF','COUNTIF']},
{n:'AVERAGEIFS',f:(r,e,c)=>`=AVERAGEIFS(E${r}:E${e},B${r}:B${e},"${c}",F${r}:F${e},"PASS")`,d:'Tính trung bình theo nhiều điều kiện.',task:'tính trung bình khi Model và trạng thái cùng thỏa mãn',cat:'Nâng cao',opts:['AVERAGEIFS','AVERAGEIF','SUMIFS','COUNTIFS']},
{n:'MAXIFS',f:(r,e,c)=>`=MAXIFS(E${r}:E${e},B${r}:B${e},"${c}")`,d:'Tìm giá trị lớn nhất thỏa mãn điều kiện.',task:'tìm số lượng lớn nhất của một Model',cat:'Nâng cao',opts:['MAXIFS','MAX','MINIFS','LARGE']},
{n:'MINIFS',f:(r,e,c)=>`=MINIFS(E${r}:E${e},B${r}:B${e},"${c}")`,d:'Tìm giá trị nhỏ nhất thỏa mãn điều kiện.',task:'tìm số lượng nhỏ nhất của một Model',cat:'Nâng cao',opts:['MINIFS','MIN','MAXIFS','SMALL']},
{n:'XLOOKUP',f:(r,e,c)=>`=XLOOKUP(A${r},H${r}:H${e},I${r}:I${e},"Không tìm thấy")`,d:'Tra cứu linh hoạt và trả về kết quả tương ứng.',task:'tìm tên hoặc thông tin theo mã tra cứu',cat:'Nâng cao',opts:['XLOOKUP','VLOOKUP','SUMIF','MATCH']},
{n:'VLOOKUP',f:(r,e,c)=>`=VLOOKUP(A${r},H${r}:J${e},3,FALSE)`,d:'Tra cứu theo cột đầu tiên của bảng.',task:'tra cứu thông tin trong bảng theo mã ở cột đầu',cat:'Nâng cao',opts:['VLOOKUP','HLOOKUP','XLOOKUP','INDEX']},
{n:'INDEX + MATCH',f:(r,e,c)=>`=INDEX(I${r}:I${e},MATCH(A${r},H${r}:H${e},0))`,d:'Kết hợp dò vị trí và trả về giá trị tương ứng.',task:'tra cứu dữ liệu bằng cách kết hợp INDEX và MATCH',cat:'Nâng cao',opts:['INDEX + MATCH','SUMIFS','VLOOKUP','FILTER']},
{n:'IFERROR',f:(r,e,c)=>`=IFERROR(A${r}/B${r},0)`,d:'Thay thế kết quả lỗi bằng giá trị dự phòng.',task:'tránh hiển thị lỗi khi phép tính không hợp lệ',cat:'Nâng cao',opts:['IFERROR','IFNA','ISERROR','IF']},
{n:'IFNA',f:(r,e,c)=>`=IFNA(XLOOKUP(A${r},H${r}:H${e},I${r}:I${e}),"Chưa có")`,d:'Xử lý riêng lỗi không tìm thấy dữ liệu #N/A.',task:'hiển thị thông báo riêng khi không tìm thấy mã',cat:'Nâng cao',opts:['IFNA','IFERROR','ISNA','IF']},
{n:'FILTER',f:(r,e,c)=>`=FILTER(A${r}:F${e},B${r}:B${e}="${c}","Không có dữ liệu")`,d:'Trả về các dòng dữ liệu đáp ứng điều kiện.',task:'lọc toàn bộ dòng theo một Model',cat:'Nâng cao',opts:['FILTER','SORT','UNIQUE','XLOOKUP']},
{n:'SORT',f:(r,e,c)=>`=SORT(A${r}:F${e},5,-1)`,d:'Sắp xếp mảng dữ liệu theo cột chỉ định.',task:'sắp xếp bảng theo cột số lượng giảm dần',cat:'Nâng cao',opts:['SORT','SORTBY','FILTER','RANK.EQ']},
{n:'UNIQUE',f:(r,e,c)=>`=UNIQUE(B${r}:B${e})`,d:'Trả về danh sách giá trị không trùng lặp.',task:'lấy danh sách Model không bị trùng',cat:'Nâng cao',opts:['UNIQUE','SORT','FILTER','REMOVE DUPLICATES']},
{n:'SUBTOTAL',f:(r,e,c)=>`=SUBTOTAL(9,E${r}:E${e})`,d:'Tính toán trên dữ liệu đã lọc, có thể bỏ qua dòng ẩn.',task:'tính tổng chỉ trên các dòng đang hiển thị sau lọc',cat:'Nâng cao',opts:['SUBTOTAL','SUM','AGGREGATE','SUMIF']},
{n:'SUMPRODUCT',f:(r,e,c)=>`=SUMPRODUCT((B${r}:B${e}="${c}")*(E${r}:E${e}))`,d:'Tính tổng có điều kiện bằng phép nhân mảng.',task:'tính tổng theo điều kiện bằng SUMPRODUCT',cat:'Nâng cao',opts:['SUMPRODUCT','SUMIFS','COUNTIFS','PRODUCT']},
{n:'RANK.EQ',f:(r,e,c)=>`=RANK.EQ(E${r},$E${r}:$E${e},0)`,d:'Xếp hạng một giá trị trong danh sách theo thứ tự giảm dần.',task:'xếp hạng số lượng từ cao xuống thấp',cat:'Nâng cao',opts:['RANK.EQ','LARGE','MAXIFS','SORT']},
{n:'TEXTJOIN',f:(r,e,c)=>`=TEXTJOIN(", ",TRUE,A${r}:A${Math.min(e,r+5)})`,d:'Nối nhiều giá trị thành một chuỗi và bỏ qua ô trống.',task:'ghép nhiều mã thành một chuỗi có dấu phân cách',cat:'Nâng cao',opts:['TEXTJOIN','CONCAT','TEXT','JOIN']},
// HÀM LỒNG — 10 nhóm x 4 = 40
{n:'IF + AND',f:(r,e,c)=>`=IF(AND(E${r}>=100,F${r}="PASS"),"Đạt","Kiểm tra")`,d:'Lồng AND trong IF để yêu cầu mọi điều kiện cùng đúng.',task:'chỉ trả về Đạt khi số lượng đủ và trạng thái PASS',cat:'Hàm lồng',opts:['IF + AND','IF + OR','IFERROR + AND','IFS']},
{n:'IF + OR',f:(r,e,c)=>`=IF(OR(F${r}="NG",G${r}="NG"),"Cảnh báo","Bình thường")`,d:'Lồng OR trong IF để cảnh báo khi một trong các điều kiện đúng.',task:'cảnh báo nếu một trong hai cột có trạng thái NG',cat:'Hàm lồng',opts:['IF + OR','IF + AND','IFS','IFERROR']},
{n:'IF + SUMIFS',f:(r,e,c)=>`=IF(SUMIFS(E${r}:E${e},B${r}:B${e},"${c}")>=100,"Đạt target","Chưa đạt")`,d:'Tính tổng theo điều kiện rồi phân loại kết quả.',task:'cộng số lượng theo Model rồi so sánh với target',cat:'Hàm lồng',opts:['IF + SUMIFS','IF + COUNTIFS','SUMIF + IFERROR','AND + SUM']},
{n:'IFERROR + XLOOKUP',f:(r,e,c)=>`=IFERROR(XLOOKUP(A${r},H${r}:H${e},I${r}:I${e}),"Không có mã")`,d:'Tra cứu bằng XLOOKUP và xử lý lỗi phát sinh.',task:'tra cứu mã và hiện thông báo nếu có lỗi',cat:'Hàm lồng',opts:['IFERROR + XLOOKUP','IFNA + SUMIFS','IF + VLOOKUP','INDEX + SUM']},
{n:'INDEX + MATCH + IFERROR',f:(r,e,c)=>`=IFERROR(INDEX(I${r}:I${e},MATCH(A${r},H${r}:H${e},0)),"Không tìm thấy")`,d:'Tra cứu hai chiều theo vị trí và xử lý trường hợp không tìm thấy.',task:'dò mã bằng INDEX MATCH và thay lỗi bằng thông báo',cat:'Hàm lồng',opts:['INDEX + MATCH + IFERROR','XLOOKUP + SUM','IF + MATCH','FILTER + IF']},
{n:'IF + COUNTIFS',f:(r,e,c)=>`=IF(COUNTIFS(B${r}:B${e},"${c}",F${r}:F${e},"NG")>0,"Có lỗi","Không có lỗi")`,d:'Đếm số dòng thỏa nhiều điều kiện rồi đưa ra cảnh báo.',task:'kiểm tra Model có phát sinh NG hay không',cat:'Hàm lồng',opts:['IF + COUNTIFS','IF + SUMIFS','COUNTIF + OR','IFERROR + COUNT']},
{n:'IF + LEFT',f:(r,e,c)=>`=IF(LEFT(A${r},3)="FPC","Nhóm FPC","Nhóm khác")`,d:'Kiểm tra tiền tố mã bằng LEFT rồi phân loại bằng IF.',task:'phân nhóm mã dựa trên ba ký tự đầu',cat:'Hàm lồng',opts:['IF + LEFT','IF + RIGHT','IF + MID','LEFT + LEN']},
{n:'IF + SEARCH',f:(r,e,c)=>`=IF(ISNUMBER(SEARCH("NG",F${r})),"Có NG","Không NG")`,d:'Tìm chuỗi con không phân biệt hoa thường rồi phân loại.',task:'phát hiện từ khóa NG nằm trong nội dung ghi chú',cat:'Hàm lồng',opts:['IF + ISNUMBER + SEARCH','IF + LEFT','IF + FIND + SUM','IFERROR + RIGHT']},
{n:'ROUND + SUMIFS',f:(r,e,c)=>`=ROUND(SUMIFS(E${r}:E${e},B${r}:B${e},"${c}")/100,2)`,d:'Tính tổng theo điều kiện, chia tỷ lệ và làm tròn kết quả.',task:'tính tỷ lệ theo Model và làm tròn hai chữ số',cat:'Hàm lồng',opts:['ROUND + SUMIFS','ROUND + COUNTIF','SUM + IFERROR','AVERAGE + IF']},
{n:'IF + AND + XLOOKUP',f:(r,e,c)=>`=IF(AND(XLOOKUP(A${r},H${r}:H${e},J${r}:J${e},"")="Active",E${r}>0),"Hợp lệ","Kiểm tra")`,d:'Tra cứu trạng thái, kiểm tra thêm điều kiện và phân loại.',task:'chỉ xác nhận hợp lệ khi mã đang Active và số lượng lớn hơn 0',cat:'Hàm lồng',opts:['IF + AND + XLOOKUP','IF + OR + SUMIF','IFERROR + COUNTIFS','INDEX + MATCH']}
];
const records=[];
patterns.forEach((p,pi)=>{
 scenarios.forEach((s,si)=>{
  const id=String(records.length+1).padStart(3,'0');
  const formula=p.f(s.r,s.e,s.code);
  const prompt=`Trong tình huống ${s.model}, bạn cần ${p.task}. Nên chọn công thức nào?`;
  const wrong=p.opts.filter(x=>x!==p.n);
  const choices=[p.n,wrong[(si+pi)%wrong.length],wrong[(si+pi+1)%wrong.length],wrong[(si+pi+2)%wrong.length]];
  const rotate=(pi+si)%4;
  const options=choices.map((_,i)=>choices[(i+rotate)%4]);
  records.push({id,name:p.n,level:p.cat,formula,description:p.d,scenario:`Ví dụ ${s.team}: ${s.field} · ${s.month}`,question:prompt,options,answer:options.indexOf(p.n),explanation:`Chọn ${p.n}. ${p.d} Công thức mẫu: ${formula}`});
 });
});
window.AVP_FORMULA_BANK=records;
})();