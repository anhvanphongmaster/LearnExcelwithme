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
        {
          type: "section",
          title: "1. Grain là gì?",
          html: `<p>Trước khi viết công thức, hãy trả lời một câu: <strong>một dòng trong bảng này đại diện cho điều gì?</strong></p>
          <p>Một dòng Sales có thể đại diện cho một đơn hàng, một sản phẩm trong đơn hàng, một giao dịch theo SKU, doanh thu của một cửa hàng trong ngày, doanh thu của một nhân viên trong ca hoặc một bản ghi đã được tổng hợp sẵn.</p>
          <p>Mức chi tiết đó chính là <strong>grain của dữ liệu</strong>.</p>`
        },
        {
          type: "example",
          title: "Ví dụ công việc",
          html: `<table><thead><tr><th>Order</th><th>Product</th><th>Qty</th><th>Revenue</th></tr></thead>
          <tbody><tr><td>ORD001</td><td>Áo</td><td>1</td><td>500.000</td></tr>
          <tr><td>ORD001</td><td>Quần</td><td>1</td><td>700.000</td></tr>
          <tr><td>ORD002</td><td>Áo</td><td>2</td><td>1.000.000</td></tr></tbody></table>
          <p>Ở đây <strong>1 dòng = 1 sản phẩm trong một đơn hàng</strong>. Vì vậy: số dòng = 3, số đơn hàng = 2, Quantity = 4 và Revenue = 2.200.000.</p>
          <p>Nếu dùng <code>=COUNTA(Order)</code> rồi kết luận có 3 đơn hàng, Excel không hề lỗi. <strong>Sai nằm ở cách hiểu dữ liệu.</strong></p>`
        },
        {
          type: "check",
          title: "Professional Check",
          html: `<ol><li>Khóa nhận diện giao dịch là gì?</li><li>Một khóa có xuất hiện nhiều lần không, và vì sao?</li><li>Một dòng là Order hay Order Detail?</li><li>Revenue đang ở grain SKU, Order, Store-Day hay mức tổng hợp khác?</li><li>Có bảng nào đã tổng hợp dữ liệu trước đó không?</li></ol>`
        },
        {
          type: "reveal",
          label: "▶ Xem Professional Note",
          title: "Professional Note",
          text: "Đừng bắt đầu một file Sales bằng câu hỏi “dùng hàm gì?”. Hãy bắt đầu bằng hai câu hỏi: dữ liệu đang ở grain nào, và KPI cần tính nằm ở grain nào? Sau khi hiểu hai điều đó, việc chọn SUMIFS, COUNTIFS, UNIQUE, PivotTable hay Power Query mới có ý nghĩa."
        },
        {
          type: "warning",
          title: "Sai lầm phổ biến",
          html: `<p>Sai grain thường không tạo <code>#VALUE!</code>, <code>#REF!</code> hay bất kỳ cảnh báo nào. Excel vẫn trả về một con số có vẻ hợp lý.</p>
          <p>Ví dụ Target tháng của một cửa hàng là 500 triệu. Nếu Merge Target vào hàng nghìn dòng giao dịch rồi SUM(Target), Target có thể bị nhân lên hàng nghìn lần dù Power Query, Pivot và SUM đều không báo lỗi.</p>`
        },
        {
          type: "checkpoint",
          title: "Mini Checkpoint",
          question: "Bảng có 10.000 dòng nhưng chỉ có 3.200 Order_ID duy nhất. Nếu cần tính số đơn hàng thì con số nào đúng?",
          options: ["10.000", "3.200"],
          answer: 1,
          explain: "10.000 là số bản ghi ở grain hiện tại. 3.200 mới là số đơn hàng duy nhất."
        }
      ]
    },
    {
      id: "sales-kpis",
      no: "KNOWLEDGE 02",
      title: "Revenue, Net Sales, Orders và Quantity",
      short: "Bốn KPI nền tảng nhưng rất dễ bị dùng lẫn.",
      summary: "Tên cột không phải là business definition. Trước khi xây báo cáo Sales, cần hiểu chính xác Revenue, Net Sales, Orders và Quantity đang được định nghĩa như thế nào trong dữ liệu của doanh nghiệp.",
      sections: [
        {
          type: "section",
          title: "1. Revenue và Net Sales",
          html: `<p><strong>Revenue</strong> thường là doanh thu ghi nhận từ giao dịch, nhưng phải xác nhận liệu giá trị đã trừ discount, return/refund, có VAT hay gồm phí vận chuyển hay chưa.</p>
          <p>Một mô hình phổ biến của Net Sales:</p>
          <div class="phb-formula">Gross Sales − Discount − Returns = Net Sales</div>
          <p>Nếu Target của công ty dựa trên Net Sales nhưng Actual lại lấy Gross Sales, công thức có thể đúng mà báo cáo vẫn sai nghiệp vụ.</p>`
        },
        {
          type: "section",
          title: "2. Orders và Quantity",
          html: `<p><strong>Orders</strong> là số đơn hàng, không phải số dòng. <strong>Quantity</strong> là số lượng sản phẩm bán ra.</p>
          <p>Một khách mua 5 sản phẩm trong một đơn: <strong>Orders = 1</strong>, <strong>Quantity = 5</strong>.</p>
          <p>Ở dữ liệu Order Detail, có thể dùng <code>=COUNTA(UNIQUE(A2:A6))</code> trong Excel 365 để đếm Order_ID duy nhất.</p>`
        },
        {
          type: "example",
          title: "Đọc KPI cùng nhau",
          html: `<table><thead><tr><th>KPI</th><th>Tháng 7</th><th>Tháng 8</th></tr></thead>
          <tbody><tr><td>Net Sales</td><td>500M</td><td>530M</td></tr>
          <tr><td>Orders</td><td>2.500</td><td>2.300</td></tr>
          <tr><td>Quantity</td><td>3.100</td><td>3.050</td></tr>
          <tr><td>AOV</td><td>200K</td><td>230K</td></tr></tbody></table>
          <p>Không nên chỉ kết luận “Sales tăng 6%”. Dữ liệu cho thấy doanh thu tăng trong khi Orders giảm; <strong>AOV tăng là một yếu tố cần phân tích tiếp</strong>.</p>`
        },
        {
          type: "reveal",
          label: "▶ Xem phân tích nghiệp vụ",
          title: "Professional Note",
          text: "Một KPI không chỉ cần công thức. Nó cần định nghĩa. Công thức SUM có thể viết trong vài giây, nhưng xác định Sales nào cần SUM, phạm vi nào được tính và mẫu số nào phù hợp mới là phần có giá trị trong công việc."
        },
        {
          type: "warning",
          title: "Sai lầm phổ biến",
          html: `<ul><li>Dùng tên cột thay cho định nghĩa nghiệp vụ.</li><li>Đếm số dòng để tính Orders.</li><li>Dùng Quantity thay cho Orders.</li><li>Trộn Gross Sales và Net Sales.</li><li>Dùng sai mẫu số khi tính KPI dẫn xuất.</li></ul>`
        },
        {
          type: "checkpoint",
          title: "Mini Checkpoint",
          question: "Net Sales = 240.000.000, Orders = 800, Quantity = 1.200. AOV đúng là bao nhiêu?",
          options: ["200.000", "300.000"],
          answer: 1,
          explain: "AOV = Net Sales / Orders = 240.000.000 / 800 = 300.000. Quantity không phải mẫu số của Average Order Value."
        }
      ]
    }
  ]
};