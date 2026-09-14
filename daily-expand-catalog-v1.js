(() => {
  'use strict';
  const Q = (q, o, a, e) => ({q, o, a, e});
  const FILES = {basic:'downloads/daily-co-ban.xlsx',intermediate:'downloads/daily-trung-cap.xlsx',advanced:'downloads/daily-nang-cao.xlsx',case:'downloads/daily-case.xlsx'};
  const L = (id, level, minutes, title, outcome, steps, quiz, tasks) => ({
    id, level, minutes, title, outcome, steps, quiz, tasks, file: FILES[level], sheet: id.split('-')[0]
  });
  const fallback = {
    basic: [
      L('db01-freeze','basic',8,'Cố định hàng tiêu đề khi cuộn','Cuộn vẫn thấy tiêu đề.',
        ['Chọn ô dưới hàng tiêu đề.','View → Freeze Panes.','Cuộn kiểm tra hàng 1 đứng yên.'],
        [Q('Cố định hàng 1, chọn ô nào trước?',['A1','A2','cột A','ô bất kỳ'],1,'Chọn A2 thì hàng 1 đứng yên.'),
         Q('Unfreeze ở đâu?',['Data','View → Freeze Panes → Unfreeze','Insert','Formulas'],1,'Cùng nhóm Freeze.')],
        ['Freeze hàng tiêu đề trên sheet db01.']),
      L('db03-paste-special','basic',8,'Paste Special chỉ dán giá trị','Tách kết quả khỏi công thức.',
        ['Copy cột công thức.','Paste Special → Values.','F2 kiểm tra không còn dấu =.'],
        [Q('Dán chỉ số, bỏ công thức?',['Paste','Paste Special → Values','Cut','Transpose'],1,'Values giữ số, bỏ công thức.'),
         Q('Transpose làm gì?',['Đổi kiểu số','Đổi hàng thành cột','Xóa format','Freeze'],1,'Xoay hàng ↔ cột.')],
        ['Dán giá trị cột DoanhThu sang cột Moc.']),
      L('db04-flash-fill','basic',8,'Flash Fill tách họ tên','Tách cột không cần TEXT.',
        ['Gõ mẫu dòng đầu.','Data → Flash Fill hoặc Ctrl+E.','Kiểm tra 5 dòng.'],
        [Q('Phím Flash Fill?',['Ctrl+T','Ctrl+E','Ctrl+F','F4'],1,'Ctrl+E.'),
         Q('Flash Fill dựa vào?',['Pivot','Mẫu dòng đầu','VBA','PQ'],1,'Nhận pattern từ ví dụ.')],
        ['Tách Họ từ HoTen bằng Flash Fill.']),
      L('db10-named-range','basic',8,'Đặt tên vùng thuế suất','Công thức đọc được: Gia*(1+ThueSuat).',
        ['Chọn ô thuế.','Name Box → ThueSuat.','Dùng tên trong công thức.'],
        [Q('Tên vùng không được có?',['Chữ','Khoảng trắng','Số cuối','Gạch dưới'],1,'Dùng Thue_Suat.'),
         Q('Sửa tên ở đâu?',['Formulas → Name Manager','View','Data Validation','Page Layout'],1,'Name Manager.')],
        ['Đặt tên ThueSuat cho B1.'])
    ],
    intermediate: [
      L('di01-index-match','intermediate',12,'INDEX + MATCH khi chưa có XLOOKUP','Tra cứu không phụ thuộc cột bên phải.',
        ['MATCH mã trong cột khóa.','INDEX cột cần lấy.','Khóa tuyệt đối cột khóa.'],
        [Q('MATCH trả về?',['Giá trị ô','Vị trí trong dải','Cả dòng','Lỗi nếu trùng'],1,'Vị trí, đưa vào INDEX.'),
         Q('Hơn VLOOKUP ở?',['Nhanh hơn luôn','Cột trả về không cần bên phải','Không cần khóa','Tự Unique'],1,'Lấy trái hoặc phải.')],
        ['Lấy DonGia theo MaSP bằng INDEX/MATCH.']),
      L('di04-cf-formula','intermediate',12,'Conditional format theo công thức','Tô cả dòng khi NG.',
        ['Chọn bảng từ cột A.','CF → Formula: =$H2="NG".','Apply đúng vùng.'],
        [Q('Vì sao $H2 chứ không H$2?',['Khóa cột điều kiện, dòng chạy theo hàng','Đẹp','Nhanh','Bắt buộc'],0,'$H khóa cột trạng thái.'),
         Q('CF có đổi giá trị ô?',['Có','Không, chỉ đổi hiển thị','Xóa số','Đổi kiểu'],1,'Chỉ format.')],
        ['Tô cả dòng khi TrangThai = NG.']),
      L('di08-subtotal','intermediate',12,'SUBTOTAL sống với Filter','Tổng chỉ dòng đang hiện.',
        ['Lọc một cửa hàng.','=SUBTOTAL(9, dải số).','So với SUM.'],
        [Q('SUBTOTAL 9 là?',['COUNTA','SUM','AVERAGE','MAX'],1,'9 = SUM.'),
         Q('Khác SUM khi Filter?',['Không khác','SUBTOTAL bỏ dòng ẩn bởi Filter','SUM bỏ ẩn','Cả hai sai'],1,'Đúng mục đích SUBTOTAL.')],
        ['Viết SUBTOTAL cho DoanhThu, lọc 1 cửa hàng.']),
      L('di15-tables-calc','intermediate',12,'Cột tính trong Table','[@SoLuong]*[@DonGia] tự đổ.',
        ['Bảng là Table.','Thêm cột, gõ công thức có @.','Thêm dòng: công thức tự theo.'],
        [Q('[@SoLuong] nghĩa là?',['Cả cột','Ô SoLuong trên đúng dòng hiện tại','Sheet khác','Tên file'],1,'Dòng hiện tại.'),
         Q('Thêm dòng Table thì cột tính?',['Copy tay','Tự điền','Mất','Đổi text'],1,'Calculated column.')],
        ['Tạo cột ThanhTien structured reference.'])
    ],
    advanced: [
      L('da01-let','advanced',15,'LET đặt biến trong công thức','Đọc được, tính một lần.',
        ['=LET(tyle,B1, doanh,C2, doanh*tyle).','Đặt tên biến rõ.','Tránh lặp XLOOKUP 3 lần.'],
        [Q('LET giúp gì?',['In đẹp','Đặt biến trung gian trong công thức','Tạo sheet','Ghi macro'],1,'Biến nội bộ.'),
         Q('Nên dùng LET khi?',['Công thức lặp một cụm nhiều lần','Ô trống','In','Freeze'],0,'Tránh tính lại.')],
        ['Viết lại hoa hồng bằng LET.']),
      L('da03-filter-unique','advanced',15,'FILTER + UNIQUE danh sách sống','Danh mục tự cập nhật.',
        ['=UNIQUE(FILTER(CuaHang, TrangThai="OK")).','Đổ ra vùng riêng.','Thêm dòng nguồn, xem danh sách đổi.'],
        [Q('FILTER trả về?',['Một ô','Mảng các dòng khớp điều kiện','Pivot','PDF'],1,'Dynamic array.'),
         Q('UNIQUE trên FILTER?',['Lọc rồi loại trùng','Xóa nguồn','Sort','In'],0,'Hai lớp.')],
        ['Liệt kê cửa hàng OK, không trùng.']),
      L('da04-xlookup-array','advanced',15,'XLOOKUP trả nhiều cột','Một lần lấy Đơn giá + Tên SP.',
        ['return_array gồm 2 cột.','Spill không bị che.','If_not_found rõ.'],
        [Q('XLOOKUP lấy 2 cột cần?',['Hai hàm tách','return_array 2 cột, ô bên phải trống','VLOOKUP 2 lần','Merge'],1,'Mảng trả về.'),
         Q('Spill bị chặn khi?',['Ô đích bên phải có dữ liệu','Có Freeze','Có Note','Có Filter'],0,'Clear ô chặn.')],
        ['XLOOKUP trả Tên + DonGia cùng lúc.']),
      L('da07-pq-custom-col','advanced',15,'Cột tùy chỉnh Power Query','Ky = Date.EndOfMonth([Ngay]).',
        ['PQ Editor → Custom Column.','Hàm M đúng kiểu.','Changed Type ngay sau.'],
        [Q('Custom Column viết bằng?',['VBA','M','DAX','HTML'],1,'Ngôn ngữ M.'),
         Q('Changed Type khi nào?',['Sau khi tạo cột ngày/số','Không cần','Sau in','Sau VBA'],0,'Sớm, trước load.')],
        ['Thêm cột Ky trong PQ, không sửa sheet nguồn.'])
    ],
    cases: [
      L('dc01-week-close','case',20,'Chốt doanh thu tuần','Một tuần, một số, đối chiếu nguồn.',
        ['Lọc đúng 7 ngày.','SUM DoanhThu + đếm đơn Unique.','Ghi số lên thẻ KPI.'],
        [Q('Chốt tuần khóa gì trước?',['Font','Khoảng ngày + grain đếm đơn','Màu KPI','VBA'],1,'Kỳ và grain.'),
         Q('Đếm đơn trên dòng hàng?',['COUNT dòng','Đếm Unique MaDon','COUNTA SP','MAX'],1,'Một đơn nhiều dòng.')],
        ['Ra 2 số: doanh thu tuần, số đơn.']),
      L('dc02-ar-match','case',20,'Đối chiếu hóa đơn và thanh toán','Tìm hóa đơn chưa thu.',
        ['Hai bảng HoaDon, ThanhToan.','Khóa MaHD.','Danh sách thiếu / thừa tiền.'],
        [Q('Thiếu tiền nghĩa là?',['Hóa đơn chưa thanh toán đủ','Sai font','Sai Freeze','Sai in'],0,'Reconciliation.'),
         Q('Khóa đối chiếu?',['MaHD sạch','Màu','Thứ tự sheet','Tên file'],0,'Khóa chung.')],
        ['Ra danh sách MaHD còn thiếu.']),
      L('dc09-price-update','case',20,'Cập nhật bảng giá theo hiệu lực','Lấy giá đúng ngày đơn.',
        ['Bảng giá có Từ ngày − Đến ngày.','Với mỗi đơn, tìm dòng giá hiệu lực.','XLOOKUP/FILTER theo khoảng ngày.'],
        [Q('Giá sai thường vì?',['Lấy giá mới nhất, bỏ qua ngày đơn','Freeze','In','Note'],0,'Hiệu lực.'),
         Q('Khoảng ngày cần?',['NgayDon nằm giữa Từ và Đến','Trùng tên SP là đủ','Màu','Sheet'],0,'Khoảng hiệu lực.')],
        ['Gắn DonGiaHieuLuc cho 10 đơn.']),
      L('dc11-month-pack','case',20,'Gói tháng: 3 số + cách refresh','Bìa gửi sếp đọc được.',
        ['Ba số đối chiếu nguồn.','Một đoạn refresh.','Không nhồi 8 biểu đồ.'],
        [Q('Bìa cần?',['Ít số đúng + cách refresh','Nhiều pie','VBA ẩn','10 font'],0,'Đủ dùng.'),
         Q('Thiếu câu refresh thì?',['Người nhận không tự làm mới được','Đẹp hơn','Nhanh hơn','An toàn hơn'],0,'Bàn giao.')],
        ['Điền 3 số + 3 dòng hướng dẫn refresh.'])
    ]
  };
  const A = window.__DX_BI || {};
  const B = window.__DX_AC || {};
  const basic = (A.basic && A.basic.length) ? A.basic : fallback.basic;
  const intermediate = (A.intermediate && A.intermediate.length) ? A.intermediate : fallback.intermediate;
  const advanced = (B.advanced && B.advanced.length) ? B.advanced : fallback.advanced;
  const cases = (B.cases && B.cases.length) ? B.cases : fallback.cases;
  const lessons = [...basic, ...intermediate, ...advanced, ...cases];
  const byId = Object.fromEntries(lessons.map(x => [x.id, x]));
  const byLevel = {
    basic: basic.map(x => x.id),
    intermediate: intermediate.map(x => x.id),
    advanced: advanced.map(x => x.id),
    case: cases.map(x => x.id)
  };
  window.AVPDailyExpand = {
    version: 'expand-60-v2-fallback16',
    lessons, byId, byLevel,
    levels: [
      {id:'basic', name:'Cơ bản', file: FILES.basic},
      {id:'intermediate', name:'Trung cấp', file: FILES.intermediate},
      {id:'advanced', name:'Nâng cao', file: FILES.advanced},
      {id:'case', name:'Case', file: FILES.case}
    ]
  };
})();
