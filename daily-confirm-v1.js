(() => {
  'use strict';
  const Q = (q, o, a, e) => ({q, o, a, e});
  window.AVPDailyConfirm = {
    'b01-freeze': Q('Muốn cố định hàng tiêu đề, chọn ô nào rồi bấm Freeze Panes?',
      ['A1','A2','Cả cột A','Ô cuối bảng'],1,'Chọn ô ngay dưới hàng cần khóa — thường là A2.'),
    'b13-hyperlink': Q('Liên kết tới sheet hướng dẫn trong cùng file dùng kiểu nào?',
      ['Email','Place in This Document','Trang web','PDF'],1,'Place in This Document trỏ 00_HuongDan!A1.'),
    't01-index-match': Q('=INDEX(C2:C5,MATCH("SP02",A2:A5,0)) lấy gì nếu C là đơn giá và SP02 ở hàng thứ 2 trong dải?',
      ['Mã SP02','Đơn giá của SP02','Vị trí 2','Cả dòng'],1,'MATCH ra vị trí, INDEX lấy đúng ô đơn giá.'),
    'n01-let': Q('=LET(x,10,y,3,x*y) ra kết quả nào?',
      ['13','30','103','7'],1,'x=10, y=3, x*y=30.'),
    'c01-week-close': Q('Chốt tuần: một đơn 3 dòng hàng thì số đơn cộng thế nào?',
      ['Cộng 3','Đếm Unique mã đơn','Cộng số lượng SP','Lấy MAX doanh thu'],1,'Đếm mã đơn không trùng, không đếm dòng chi tiết.'),
    'b02-print-fit': Q('In vừa một trang: Set Print Area nằm ở tab nào?',
      ['Home','Page Layout','View','Data'],1,'Page Layout → Print Area.'),
    'b14-split-window': Q('Split khác Freeze ở điểm nào?',
      ['Giống nhau','Split chia cửa sổ kéo được; Freeze khóa hàng/cột','Split xóa dữ liệu','Freeze chỉ dùng khi in'],1,'Hai lệnh khác mục đích.'),
    't02-countif-wild': Q('=COUNTIF(A2:A6,"HN-*") đếm những mã nào?',
      ['Mọi mã','Mã bắt đầu bằng HN-','Mã đúng 4 ký tự','Mã chứa số'],1,'* là nhiều ký tự sau HN-.'),
    'n02-lambda': Q('Hàm LAMBDA dùng lại được thì lưu ở đâu?',
      ['Ô A1','Name Manager','Print Area','Status bar'],1,'Đặt tên trong Name Manager rồi gọi như hàm.'),
    'c02-ar-match': Q('Đối chiếu hóa đơn: ô nào được coi là còn thiếu tiền?',
      ['Phải thu − đã thu > 0','Sai font','Trùng tên file','Thiếu màu'],0,'Thiếu = còn phải thu sau khi trừ đã thu.'),
    'b03-paste-values': Q('Muốn cột mốc giữ số, không còn dấu = thì dán kiểu nào?',
      ['Paste thường','Paste Special → Values','Cut','Transpose'],1,'Values chỉ lấy kết quả.'),
    'b15-linked-picture': Q('Linked Picture khác ảnh copy thường ở chỗ nào?',
      ['Không khác','Ảnh đổi theo số gốc','Ảnh xóa nguồn','Chỉ dùng khi in'],1,'Số nguồn đổi thì ảnh trên bìa đổi.'),
    't03-textjoin': Q('=TEXTJOIN(", ",TRUE,{"A","","C"}) ra chuỗi nào?',
      ['A, , C','A, C','A,,C','AC'],1,'TRUE bỏ ô trống nên không thừa dấu phẩy.'),
    'n03-filter-unique': Q('=UNIQUE(FILTER(CuaHang,TrangThai="OK")) trả về gì?',
      ['Một ô','Danh sách cửa hàng OK, không trùng','Pivot','PDF'],1,'Lọc OK rồi loại trùng.'),
    'c03-stock-gap': Q('Lệch tồn = sổ − kiểm kê. Xếp top 5 nên lấy theo gì?',
      ['Số dương thôi','|Lệch| để thiếu và thừa đều vào top','Font','Thứ tự sheet'],1,'Quan tâm độ lớn, không bỏ số âm.')
  };
})();
