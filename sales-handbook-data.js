window.AVPSalesHandbook = {
  title: "Sales Professional Handbook",
  subtitle: "Professional Knowledge · Sales & Commercial",
  chapters: [
    {
      id: "data-grain",
      no: "KNOWLEDGE 01",
      title: "Data Grain — Mỗi dòng dữ liệu đang đại diện cho điều gì?",
      short: "Hiểu đúng grain trước khi tính bất kỳ KPI nào.",
      summary: "Một công thức có thể đúng hoàn toàn nhưng báo cáo vẫn sai nếu bạn hiểu sai mức chi tiết của dữ liệu. Đây là nguyên tắc nền tảng trước khi dùng SUMIFS, PivotTable hay Power Query.",
      sections: [
        {type:"section",title:"1. Grain là gì?",html:`<p>Trước khi viết công thức, hãy trả lời một câu: <strong>một dòng trong bảng này đại diện cho điều gì?</strong></p><p>Một dòng Sales có thể là một đơn hàng, một sản phẩm trong đơn hàng, doanh thu của một cửa hàng trong ngày, doanh thu của một nhân viên trong ca hoặc một bản ghi đã tổng hợp sẵn.</p><p>Mức chi tiết đó chính là <strong>grain của dữ liệu</strong>.</p>`},
        {type:"example",title:"Ví dụ công việc",html:`<table><thead><tr><th>Order</th><th>Product</th><th>Qty</th><th>Revenue</th></tr></thead><tbody><tr><td>ORD001</td><td>Áo</td><td>1</td><td>500.000</td></tr><tr><td>ORD001</td><td>Quần</td><td>1</td><td>700.000</td></tr><tr><td>ORD002</td><td>Áo</td><td>2</td><td>1.000.000</td></tr></tbody></table><p>Ở đây <strong>1 dòng = 1 sản phẩm trong một đơn hàng</strong>. Số dòng = 3, số đơn hàng = 2, Quantity = 4 và Revenue = 2.200.000.</p>`},
        {type:"check",title:"Professional Check",html:`<ol><li>Khóa nhận diện giao dịch là gì?</li><li>Một khóa có xuất hiện nhiều lần không, và vì sao?</li><li>Một dòng là Order hay Order Detail?</li><li>Revenue đang ở grain SKU, Order, Store-Day hay mức tổng hợp khác?</li><li>Có bảng nào đã tổng hợp dữ liệu trước đó không?</li></ol>`},
        {type:"reveal",label:"▶ Xem Professional Note",title:"Professional Note",text:"Đừng bắt đầu một file Sales bằng câu hỏi dùng hàm gì. Hãy bắt đầu bằng hai câu hỏi: dữ liệu đang ở grain nào, và KPI cần tính nằm ở grain nào?"},
        {type:"warning",title:"Sai lầm phổ biến",html:`<p>Sai grain thường không tạo #VALUE!, #REF! hay cảnh báo nào. Excel vẫn trả về một con số có vẻ hợp lý.</p><p>Ví dụ Target tháng của một cửa hàng là 500 triệu. Nếu Merge Target vào hàng nghìn dòng giao dịch rồi SUM(Target), Target có thể bị nhân lên hàng nghìn lần.</p>`},
        {type:"checkpoint",title:"Mini Checkpoint",question:"Bảng có 10.000 dòng nhưng chỉ có 3.200 Order_ID duy nhất. Nếu cần tính số đơn hàng thì con số nào đúng?",options:["10.000","3.200"],answer:1,explain:"10.000 là số bản ghi ở grain hiện tại. 3.200 mới là số đơn hàng duy nhất."}
      ]
    },
    {
      id: "keys-dimensions",
      no: "KNOWLEDGE 02",
      title: "Keys & Dimensions — Khóa nào dùng để nối dữ liệu?",
      short: "Tách khóa giao dịch và khóa danh mục để tránh nhân bản dòng.",
      summary: "Sales thường cần nối Order, Product, Store, Staff và Calendar. Chọn sai khóa hoặc nối bảng nhiều-nhiều có thể làm phình dữ liệu mà không tạo lỗi kỹ thuật.",
      sections: [
        {type:"section",title:"1. Transaction key và dimension key",html:`<p><strong>Transaction key</strong> nhận diện giao dịch: Order_ID, Line_ID hoặc kết hợp Order_ID + SKU.</p><p><strong>Dimension key</strong> nhận diện thực thể dùng để phân tích: Store_Code, Staff_ID, SKU, Date.</p><p>Mỗi bảng nên có grain và khóa rõ trước khi Merge hoặc XLOOKUP.</p>`},
        {type:"example",title:"Kiểm tra trước khi Merge",html:`<p>Nếu bảng Staff Master có 2 dòng cùng Staff_ID vì nhân viên đổi cửa hàng, việc Merge chỉ bằng Staff_ID có thể nhân đôi giao dịch.</p><p>Giải pháp có thể là dùng effective date, Staff_ID + thời gian hiệu lực hoặc chuẩn hóa bảng Staff thành một dòng duy nhất cho mục đích hiện tại.</p>`},
        {type:"check",title:"Bộ kiểm tra khóa",html:`<ul><li>Khóa phía dimension có unique không?</li><li>Bản ghi không match sẽ được xử lý thế nào?</li><li>Merge xong số dòng có tăng bất thường không?</li><li>Tổng Revenue trước và sau Merge có giữ nguyên không?</li></ul>`},
        {type:"reveal",label:"▶ Xem nguyên tắc nối bảng",title:"Professional Note",text:"Sau mỗi Merge quan trọng, luôn kiểm tra ít nhất ba thứ: số dòng, số khóa duy nhất và control total của Revenue. Nếu một trong ba thay đổi ngoài dự kiến, đừng tiếp tục làm dashboard."},
        {type:"warning",title:"Sai lầm phổ biến",html:`<p>Thấy hai bảng cùng có cột Tên cửa hàng rồi nối bằng tên. Tên hiển thị có thể đổi chính tả, viết tắt hoặc trùng nhau. Ưu tiên mã chuẩn thay vì text mô tả.</p>`},
        {type:"checkpoint",title:"Mini Checkpoint",question:"Bảng Store Master phải dùng làm dimension. Điều kiện quan trọng nhất của Store_Code là gì?",options:["Có màu giống bảng Sales","Unique theo mỗi cửa hàng"],answer:1,explain:"Dimension key phải xác định một thực thể duy nhất, nếu không Merge có thể nhân bản dòng."}
      ]
    },
    {
      id: "sales-kpis",
      no: "KNOWLEDGE 03",
      title: "Revenue, Net Sales, Orders và Quantity",
      short: "Bốn KPI nền tảng nhưng rất dễ bị dùng lẫn.",
      summary: "Tên cột không phải là business definition. Trước khi xây báo cáo Sales, cần hiểu chính xác Revenue, Net Sales, Orders và Quantity đang được định nghĩa như thế nào trong dữ liệu của doanh nghiệp.",
      sections: [
        {type:"section",title:"1. Revenue và Net Sales",html:`<p><strong>Revenue</strong> thường là doanh thu ghi nhận từ giao dịch, nhưng phải xác nhận giá trị đã trừ discount, return/refund, có VAT hay phí vận chuyển chưa.</p><div class="phb-formula">Gross Sales − Discount − Returns = Net Sales</div><p>Nếu Target dựa trên Net Sales nhưng Actual lấy Gross Sales, báo cáo sai nghiệp vụ dù công thức SUM đúng.</p>`},
        {type:"section",title:"2. Orders và Quantity",html:`<p><strong>Orders</strong> là số đơn hàng, không phải số dòng. <strong>Quantity</strong> là số lượng sản phẩm bán ra.</p><p>Một khách mua 5 sản phẩm trong một đơn: Orders = 1, Quantity = 5.</p>`},
        {type:"example",title:"Đọc KPI cùng nhau",html:`<table><thead><tr><th>KPI</th><th>Tháng 7</th><th>Tháng 8</th></tr></thead><tbody><tr><td>Net Sales</td><td>500M</td><td>530M</td></tr><tr><td>Orders</td><td>2.500</td><td>2.300</td></tr><tr><td>Quantity</td><td>3.100</td><td>3.050</td></tr><tr><td>AOV</td><td>200K</td><td>230K</td></tr></tbody></table><p>Không nên chỉ kết luận Sales tăng 6%. Revenue tăng trong khi Orders giảm; AOV tăng là yếu tố cần phân tích tiếp.</p>`},
        {type:"reveal",label:"▶ Xem phân tích nghiệp vụ",title:"Professional Note",text:"Một KPI không chỉ cần công thức. Nó cần định nghĩa, phạm vi áp dụng và grain phù hợp. Đó mới là phần có giá trị trong công việc."},
        {type:"warning",title:"Sai lầm phổ biến",html:`<ul><li>Dùng tên cột thay cho định nghĩa nghiệp vụ.</li><li>Đếm số dòng để tính Orders.</li><li>Dùng Quantity thay cho Orders.</li><li>Trộn Gross Sales và Net Sales.</li></ul>`},
        {type:"checkpoint",title:"Mini Checkpoint",question:"Net Sales = 240.000.000, Orders = 800, Quantity = 1.200. AOV đúng là bao nhiêu?",options:["200.000","300.000"],answer:1,explain:"AOV = Net Sales / Orders = 240.000.000 / 800 = 300.000."}
      ]
    },
    {
      id: "revenue-control",
      no: "KNOWLEDGE 04",
      title: "Discount, Returns & Revenue Reconciliation",
      short: "Đối soát doanh thu trước khi phân tích hiệu suất.",
      summary: "Một báo cáo Sales chuyên nghiệp phải giải thích được vì sao Revenue thay đổi và phải đối chiếu được từ dữ liệu giao dịch đến tổng quản trị.",
      sections: [
        {type:"section",title:"1. Tách Gross, Discount, Return và Net",html:`<p>Không nên để một cột Revenue gánh nhiều nghĩa. Nếu nguồn có đủ dữ liệu, hãy tách Gross Sales, Discount, Return/Refund và Net Sales.</p><p>Nhờ đó bạn có thể xác định tăng trưởng đến từ bán nhiều hơn hay chỉ do discount thay đổi.</p>`},
        {type:"example",title:"Control total",html:`<p>Trước khi làm Pivot, ghi lại tổng Net Sales của nguồn. Sau khi clean, Merge và Append, tổng đó phải được đối chiếu lại.</p><table><thead><tr><th>Bước</th><th>Net Sales</th><th>Chênh lệch</th></tr></thead><tbody><tr><td>Raw source</td><td>1.250M</td><td>—</td></tr><tr><td>After clean</td><td>1.250M</td><td>0</td></tr><tr><td>After merge</td><td>1.250M</td><td>0</td></tr></tbody></table>`},
        {type:"check",title:"Reconciliation checklist",html:`<ul><li>Đơn cancelled có được tính không?</li><li>Refund nằm ở ngày bán hay ngày hoàn?</li><li>Discount theo line hay theo order?</li><li>VAT có nằm trong doanh thu mục tiêu?</li><li>Control total trước/sau xử lý có khớp?</li></ul>`},
        {type:"reveal",label:"▶ Xem cách xử lý lệch",title:"Professional Note",text:"Nếu control total lệch, dừng việc dựng biểu đồ. Truy ngược theo từng bước biến đổi và tìm bước đầu tiên tạo chênh lệch. Sửa tại nguồn logic, không vá số ở dashboard."},
        {type:"warning",title:"Sai lầm phổ biến",html:`<p>Loại dòng Return khỏi dataset nhưng vẫn dùng Net Sales đã trừ Return ở nguồn khác. Kết quả là hoàn trả bị xử lý hai lần.</p>`},
        {type:"checkpoint",title:"Mini Checkpoint",question:"Sau Merge Store Master, số dòng tăng 8% và Net Sales cũng tăng 8%. Khả năng cao nhất là gì?",options:["Do format màu","Dimension key không unique làm nhân bản giao dịch"],answer:1,explain:"Merge nhiều-nhiều thường làm tăng số dòng và tổng doanh thu cùng lúc."}
      ]
    },
    {
      id: "aov-upt-asp",
      no: "KNOWLEDGE 05",
      title: "AOV, UPT, ASP — Đọc chất lượng của đơn hàng",
      short: "Tách giá trị đơn, số món và giá bán trung bình.",
      summary: "Revenue tăng chưa đủ để kết luận hiệu suất tốt hơn. AOV, UPT và ASP giúp phân rã doanh thu thành hành vi mua và cấu trúc giỏ hàng.",
      sections: [
        {type:"section",title:"1. Ba KPI dẫn xuất",html:`<div class="phb-formula">AOV = Net Sales / Orders</div><div class="phb-formula">UPT = Quantity / Orders</div><div class="phb-formula">ASP = Net Sales / Quantity</div><p>AOV tăng có thể đến từ UPT tăng, ASP tăng hoặc cả hai.</p>`},
        {type:"example",title:"Phân rã AOV",html:`<table><thead><tr><th>KPI</th><th>Kỳ A</th><th>Kỳ B</th></tr></thead><tbody><tr><td>AOV</td><td>400K</td><td>450K</td></tr><tr><td>UPT</td><td>1,6</td><td>1,5</td></tr><tr><td>ASP</td><td>250K</td><td>300K</td></tr></tbody></table><p>AOV tăng dù UPT giảm; nguyên nhân chính có thể là ASP tăng do mix sản phẩm hoặc giá bán.</p>`},
        {type:"check",title:"Câu hỏi phân tích",html:`<ul><li>AOV tăng ở tất cả cửa hàng hay chỉ vài cửa hàng?</li><li>UPT giảm có phải do thiếu hàng?</li><li>ASP tăng do giá hay do mix sản phẩm cao cấp?</li><li>Discount có thay đổi cùng kỳ không?</li></ul>`},
        {type:"reveal",label:"▶ Xem cách đọc sâu hơn",title:"Professional Note",text:"Khi một KPI tổng thay đổi, hãy phân rã thành các driver có quan hệ toán học hoặc nghiệp vụ. Đó là cách biến dashboard từ màn hình số liệu thành công cụ phân tích."},
        {type:"warning",title:"Sai lầm phổ biến",html:`<p>Tính AOV bằng Revenue / Quantity. Công thức đó thực chất gần với ASP, không phải Average Order Value.</p>`},
        {type:"checkpoint",title:"Mini Checkpoint",question:"Revenue = 90M, Orders = 300, Quantity = 450. UPT bằng bao nhiêu?",options:["1,5","300.000"],answer:0,explain:"UPT = Quantity / Orders = 450 / 300 = 1,5 sản phẩm/đơn."}
      ]
    },
    {
      id: "mix-variance",
      no: "KNOWLEDGE 06",
      title: "Mix, Contribution & Variance",
      short: "Biết phần nào đang kéo tổng kết quả lên hoặc xuống.",
      summary: "KPI tổng cho biết chuyện gì xảy ra; mix, contribution và variance giúp chỉ ra nhóm nào tạo ra thay đổi đó.",
      sections: [
        {type:"section",title:"1. Contribution",html:`<div class="phb-formula">Contribution % = Sales của nhóm / Total Sales</div><p>Có thể tính theo Store, Region, Staff, Product Category hoặc Channel. Tổng contribution trong cùng phạm vi phải xấp xỉ 100%.</p>`},
        {type:"section",title:"2. Variance",html:`<div class="phb-formula">Variance = Actual − Baseline</div><div class="phb-formula">Variance % = (Actual − Baseline) / Baseline</div><p>Baseline có thể là kỳ trước, cùng kỳ năm trước hoặc Target tùy câu hỏi quản trị.</p>`},
        {type:"example",title:"Đừng chỉ nhìn tăng trưởng tổng",html:`<p>Total Sales tăng 5%, nhưng Store A tăng 30% trong khi 8 cửa hàng còn lại giảm. Báo cáo tổng dễ che mất rủi ro lan rộng.</p><p>Nên thêm contribution và variance theo Store để xác định tăng trưởng có bền vững hay phụ thuộc một điểm bán.</p>`},
        {type:"reveal",label:"▶ Xem cách kể câu chuyện",title:"Professional Note",text:"Một insight tốt thường có cấu trúc: KPI thay đổi bao nhiêu, nhóm nào đóng góp chính, driver nào giải thích và hành động nào cần theo dõi tiếp."},
        {type:"warning",title:"Sai lầm phổ biến",html:`<p>So sánh phần trăm giữa hai kỳ nhưng mẫu số kỳ trước bằng 0 hoặc quá nhỏ. Khi đó variance % có thể gây hiểu nhầm; cần hiển thị cả giá trị tuyệt đối.</p>`},
        {type:"checkpoint",title:"Mini Checkpoint",question:"Một cửa hàng chiếm 400M trên tổng 2.000M. Contribution bằng bao nhiêu?",options:["20%","500%"],answer:0,explain:"400 / 2.000 = 20%."}
      ]
    },
    {
      id: "target-allocation",
      no: "KNOWLEDGE 07",
      title: "Target Allocation — Phân bổ mục tiêu đúng grain",
      short: "Target tháng không được cộng lặp theo dòng giao dịch.",
      summary: "Target thường ở grain Month-Store hoặc Month-Staff, còn Actual có thể ở grain giao dịch. Cần đưa hai bên về cùng grain trước khi so sánh.",
      sections: [
        {type:"section",title:"1. Chốt grain của Target",html:`<p>Ví dụ Target cửa hàng là 600M/tháng. Bảng Target nên có một dòng cho Store-Month hoặc một cấu trúc phân bổ ngày rõ ràng.</p><p>Không nên Merge 600M vào từng dòng Order Detail rồi SUM.</p>`},
        {type:"section",title:"2. Phân bổ theo thời gian",html:`<p>Nếu cần Target cho khoảng ngày tùy chọn, có thể phân bổ theo ngày làm việc, trọng số weekday/weekend hoặc kế hoạch ngày do doanh nghiệp cung cấp.</p><div class="phb-formula">Selected Target = Tổng Daily Target trong khoảng lọc</div>`},
        {type:"example",title:"Ví dụ phân bổ",html:`<p>Target tháng 310M trong tháng 31 ngày và doanh nghiệp dùng phân bổ đều: Daily Target = 10M. Chọn ngày 1–10 thì Selected Target = 100M.</p><p>Nếu doanh nghiệp có trọng số cuối tuần cao hơn thì không được dùng chia đều.</p>`},
        {type:"check",title:"Target QA",html:`<ul><li>Tổng Daily Target có bằng Monthly Target?</li><li>Store/Staff mapping có đầy đủ?</li><li>Ngày nghỉ có Target không?</li><li>Khoảng lọc có lấy đúng ngày?</li></ul>`},
        {type:"warning",title:"Sai lầm phổ biến",html:`<p>Dùng Target tháng cố định để so với Actual của 7 ngày đầu tháng. Achievement lúc đó thấp giả tạo vì hai bên khác phạm vi thời gian.</p>`},
        {type:"checkpoint",title:"Mini Checkpoint",question:"Actual đang lọc 10 ngày đầu tháng. Target nào phù hợp nhất để tính Achievement?",options:["Target cả tháng bất kể bộ lọc","Target được phân bổ cho đúng 10 ngày đó"],answer:1,explain:"Actual và Target phải cùng phạm vi thời gian để so sánh có ý nghĩa."}
      ]
    },
    {
      id: "achievement-gap-runrate",
      no: "KNOWLEDGE 08",
      title: "Achievement, Gap & Run-rate",
      short: "Đọc trạng thái đạt mục tiêu và tốc độ cần thiết để về đích.",
      summary: "Target vs Actual không chỉ là một phần trăm. Cần biết thiếu bao nhiêu, còn bao nhiêu ngày và tốc độ bán cần đạt từ hiện tại.",
      sections: [
        {type:"section",title:"1. Achievement và Gap",html:`<div class="phb-formula">Achievement % = Actual / Target</div><div class="phb-formula">Gap = Actual − Target</div><p>Gap âm nghĩa là thiếu mục tiêu; nên thống nhất cách hiển thị để tránh hiểu ngược.</p>`},
        {type:"section",title:"2. Required run-rate",html:`<div class="phb-formula">Required Daily Sales = (Monthly Target − Actual to date) / Remaining Days</div><p>Run-rate giúp biến báo cáo từ nhìn quá khứ sang hỗ trợ hành động phần còn lại của kỳ.</p>`},
        {type:"example",title:"Ví dụ",html:`<p>Target tháng = 900M, Actual hiện tại = 600M, còn 10 ngày. Cần thêm 300M, tức trung bình 30M/ngày.</p><p>Nếu tốc độ 7 ngày gần nhất chỉ 20M/ngày, rủi ro không đạt Target là rõ ràng.</p>`},
        {type:"reveal",label:"▶ Xem cách dùng run-rate",title:"Professional Note",text:"Run-rate không phải dự báo hoàn hảo. Nó là chỉ báo điều hành. Hãy so tốc độ cần đạt với tốc độ gần đây để đánh giá mức độ thực tế."},
        {type:"warning",title:"Sai lầm phổ biến",html:`<p>Chia phần còn thiếu cho toàn bộ số ngày trong tháng thay vì số ngày còn lại, khiến required daily sales thấp hơn thực tế.</p>`},
        {type:"checkpoint",title:"Mini Checkpoint",question:"Target 500M, Actual 350M, còn 5 ngày. Required Daily Sales là bao nhiêu?",options:["30M/ngày","70M/ngày"],answer:0,explain:"Còn thiếu 150M. 150 / 5 = 30M/ngày."}
      ]
    },
    {
      id: "traffic-conversion",
      no: "KNOWLEDGE 09",
      title: "Traffic, Conversion & Funnel",
      short: "Kết nối lượng khách với kết quả bán hàng.",
      summary: "Khi có dữ liệu Traffic, Sales có thể được phân tích theo funnel thay vì chỉ nhìn Revenue. Mẫu số và phạm vi thời gian phải đặc biệt nhất quán.",
      sections: [
        {type:"section",title:"1. Conversion Rate",html:`<div class="phb-formula">Store CR = Orders / Traffic</div><p>Nếu Traffic là lượt khách vào cửa hàng thì Orders phải nằm trong cùng cửa hàng và cùng khoảng thời gian.</p>`},
        {type:"section",title:"2. Funnel",html:`<p>Một funnel có thể là <strong>View → Touch → Try → Buy</strong>. Mỗi bước cần định nghĩa sự kiện và mẫu số.</p><div class="phb-formula">Step Conversion = Bước sau / Bước trước</div>`},
        {type:"example",title:"Đọc funnel",html:`<table><thead><tr><th>Bước</th><th>Số lượng</th></tr></thead><tbody><tr><td>Traffic</td><td>1.000</td></tr><tr><td>Try</td><td>300</td></tr><tr><td>Orders</td><td>120</td></tr></tbody></table><p>Store CR = 12%; Try rate = 30%; Try-to-Buy = 40%. Có thể xác định điểm rơi lớn nhất trong hành trình.</p>`},
        {type:"check",title:"Traffic QA",html:`<ul><li>Traffic là người hay lượt?</li><li>Nhân viên có thể phục vụ nhiều khách cùng lúc không?</li><li>Khung giờ Sales và Traffic có đồng nhất timezone/ca?</li><li>Đơn online có nằm trong Revenue nhưng không có Traffic tại cửa hàng không?</li></ul>`},
        {type:"warning",title:"Sai lầm phổ biến",html:`<p>Dùng Orders của cả ngày chia Traffic của một vài khung giờ. CR có thể vượt 100% hoặc biến động vô lý do khác phạm vi.</p>`},
        {type:"checkpoint",title:"Mini Checkpoint",question:"Traffic = 800, Orders = 96. Store CR bằng bao nhiêu?",options:["12%","8,33%"],answer:0,explain:"96 / 800 = 12%."}
      ]
    },
    {
      id: "handover-storytelling",
      no: "KNOWLEDGE 10",
      title: "Reconciliation, Storytelling & Handover",
      short: "Biến file Sales thành sản phẩm có thể kiểm tra và bàn giao.",
      summary: "Một dashboard đẹp chưa phải deliverable chuyên nghiệp. File cần có control total, logic rõ, trạng thái refresh, hướng dẫn sử dụng và khả năng truy ngược số liệu.",
      sections: [
        {type:"section",title:"1. Final QA trước khi bàn giao",html:`<ul><li>Đối chiếu Revenue, Orders, Quantity với nguồn.</li><li>Kiểm thử bộ lọc ngày, Store, Staff và các trường hợp không có dữ liệu.</li><li>Kiểm tra Target không bị nhân bản.</li><li>Kiểm tra CR đúng mẫu số.</li><li>Refresh toàn bộ và quan sát lỗi nguồn/query.</li></ul>`},
        {type:"section",title:"2. Storytelling",html:`<p>Mỗi dashboard nên trả lời ba lớp: <strong>What happened?</strong> → <strong>Why?</strong> → <strong>What next?</strong></p><p>Ví dụ: Sales -8%; nguyên nhân chính là Orders -12% trong khi AOV +5%; Store B và C đóng góp phần lớn mức giảm; cần kiểm tra traffic và conversion tại hai cửa hàng này.</p>`},
        {type:"example",title:"Cấu trúc bàn giao",html:`<p>Một file tốt nên có vùng Input/Source rõ, vùng xử lý hoặc query, vùng Report, hướng dẫn refresh và ghi chú định nghĩa KPI.</p><p>Nếu người nhận phải hỏi bạn mỗi lần refresh thì file chưa thực sự được bàn giao.</p>`},
        {type:"reveal",label:"▶ Xem tiêu chuẩn Pro",title:"Professional Note",text:"Tiêu chuẩn cuối cùng không phải là file chạy trên máy của người làm. Tiêu chuẩn là người khác có thể mở, hiểu, refresh, kiểm tra và tiếp tục vận hành mà không làm sai logic."},
        {type:"warning",title:"Sai lầm phổ biến",html:`<p>Ẩn toàn bộ helper/query để file nhìn sạch nhưng không để lại tài liệu hoặc đường truy vết. Khi số liệu lệch, không ai biết phải kiểm tra từ đâu.</p>`},
        {type:"checkpoint",title:"Mini Checkpoint",question:"Điều nào thể hiện một file Sales đã sẵn sàng bàn giao?",options:["Chỉ cần dashboard đẹp","Có QA, định nghĩa KPI, hướng dẫn refresh và khả năng truy vết"],answer:1,explain:"Bàn giao chuyên nghiệp cần cả tính đúng, khả năng vận hành và khả năng kiểm tra lại."}
      ]
    }
  ]
};
