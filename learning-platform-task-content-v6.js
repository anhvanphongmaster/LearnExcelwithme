(() => {
  'use strict';
  if (window.__AVP_TASK_CONTENT_V6__) return;
  window.__AVP_TASK_CONTENT_V6__ = true;

  const lessons=window.AVPKnowledgeLessons||[];
  const byId=new Map(lessons.map(x=>[x.id,x]));
  const q=(text,options,answer,explain)=>({q:text,options,answer,explain});
  const sec=(title,why,steps,body,example,warning,kind='core',questions=[])=>({title,kind,why,steps,body,example,warning,questions});
  const replace=(id,data)=>{const l=byId.get(id);if(!l)return;['hook','outcomes','useCases','guide','sections'].forEach(k=>{if(data[k])l[k]=data[k]})};

  replace('f04-formulas-references',{
    hook:'Bạn có đơn giá ở B2, số lượng ở C2 và cần tính thành tiền cho hàng trăm dòng. Bài này tập trung vào cách nhập công thức, hiểu tham chiếu và dùng F4 để kéo công thức mà không bị lệch.',
    outcomes:['Nhập công thức đúng từ dấu =','Phân biệt tham chiếu tương đối và tuyệt đối','Dùng F4 để khóa đúng hàng/cột','Kiểm tra công thức sau khi kéo xuống'],
    useCases:['Tính Amount = Qty × Price','Nhân doanh số với tỷ lệ cố định','Tra cứu theo bảng có vùng cần khóa','Sao chép công thức xuống hàng nghìn dòng'],
    guide:{task:'Bạn cần viết một công thức rồi kéo xuống nhiều dòng mà kết quả vẫn đúng.',tool:'Formula bar + tham chiếu ô + F4',steps:['Chọn ô kết quả','Gõ = rồi bấm các ô cần tính','Enter và kiểm tra dòng đầu','Nếu có vùng/hệ số cố định, chọn tham chiếu đó trong công thức và nhấn F4','Kéo công thức xuống 2–3 dòng','Bấm từng ô để kiểm tra tham chiếu đã dịch/đứng đúng chỗ'],success:'Các dòng mới dùng dữ liệu của chính hàng đó; vùng/hệ số cố định không bị trôi.',mistake:'Khóa tất cả tham chiếu bằng $ hoặc không khóa vùng cố định.'},
    sections:[
      sec('1. Viết công thức đầu tiên từ dữ liệu thật','Hiểu công thức dễ nhất khi bắt đầu từ một phép tính công việc cụ thể.',[
        'Giả sử B2 là Qty, C2 là Unit Price.','Chọn D2.','Gõ =B2*C2.','Nhấn Enter.','So kết quả với phép tính tay của dòng đầu.'
      ],['Mọi công thức Excel bắt đầu bằng dấu =. Khi bấm ô thay vì tự gõ địa chỉ, bạn giảm lỗi nhập sai tham chiếu.','Trước khi kéo công thức hàng loạt, luôn xác nhận một dòng mẫu đúng.'],{title:'Ví dụ',formula:'=B2*C2',text:'Tính thành tiền của dòng 2.'},'Nếu Qty hoặc Price đang là Text, phép tính có thể sai hoặc trả lỗi dù nhìn giống số.','core',[q('Công thức Excel bắt đầu bằng ký tự nào?',['=','@','#','%'],0,'Dấu = báo Excel đây là công thức.')]),
      sec('2. Hiểu vì sao B2 đổi thành B3 khi kéo','Tham chiếu tương đối là cơ chế giúp một công thức dùng được cho nhiều dòng.',[
        'Tại D2 dùng =B2*C2.','Kéo fill handle xuống D3.','Bấm D3 và nhìn Formula Bar.','Xác nhận công thức đã thành =B3*C3.'
      ],['B2/C2 là tham chiếu tương đối. Khi copy xuống một hàng, Excel dịch chúng xuống một hàng.','Đây là hành vi đúng khi mỗi dòng phải tính từ dữ liệu cùng dòng.'],{title:'Kết quả mong đợi',formula:'D2: =B2*C2 → D3: =B3*C3',text:'Công thức dịch theo vị trí mới.'},'Nếu bạn thấy D3 vẫn tham chiếu B2/C2 thì có thể đã khóa sai bằng $.','core'),
      sec('3. Dùng F4 để khóa vùng hoặc hệ số cố định','Một số tham chiếu phải đứng yên khi công thức được kéo.',[
        'Giả sử F1 chứa tỷ lệ VAT 8%.','Tại E2 nhập =D2*F1.','Đặt con trỏ vào F1 trong Formula Bar.','Nhấn F4 để thành $F$1.','Kéo xuống và kiểm tra E3/E4 vẫn dùng $F$1.'
      ],['$F$1 khóa cả cột F và hàng 1. $F1 chỉ khóa cột; F$1 chỉ khóa hàng.','Đừng học ký hiệu như lý thuyết rời rạc. Hãy hỏi: khi kéo công thức, phần nào được phép dịch và phần nào phải đứng yên?'],{title:'Ví dụ',formula:'=D2*$F$1',text:'D2 thay đổi theo dòng, F1 luôn giữ nguyên.'},'Khóa sai có thể cho số trông vẫn hợp lý ở vài dòng đầu. Luôn kiểm tra ít nhất 2–3 dòng sau khi kéo.','core',[q('Muốn F1 không đổi khi kéo xuống nên dùng?',['F1','$F$1','F$2','$A1'],1,'$F$1 khóa cả hàng và cột của F1.')]),
      sec('4. Học thêm: khóa hỗn hợp khi làm bảng 2 chiều','Dùng khi công thức được kéo cả ngang lẫn dọc.',[
        'Xác định tiêu đề hàng cần cố định hàng nào.','Xác định tiêu đề cột cần cố định cột nào.','Dùng A$1 hoặc $A1 thay vì khóa tuyệt đối cả hai.','Kéo thử ngang và dọc một ô để kiểm tra.'
      ],['Mixed reference hữu ích trong bảng giá, ma trận KPI hoặc multiplication table.','Nếu chỉ kéo theo một chiều, thường bạn không cần phức tạp hóa bằng khóa hỗn hợp.'],{title:'Ví dụ ý tưởng',formula:'=$A2*B$1',text:'Cột A đứng yên khi kéo ngang; hàng 1 đứng yên khi kéo dọc.'},null,'extension')
    ]
  });

  replace('f06-data-table-structure',{
    hook:'Bạn có một bảng 5.000 dòng nhưng Pivot, Filter và Power Query thường lỗi vì dữ liệu bị chèn dòng tiêu đề phụ, merge cell và mỗi cột chứa nhiều kiểu thông tin. Bài này sửa từ cấu trúc nguồn.',
    outcomes:['Nhận ra một bảng dữ liệu chuẩn','Hiểu một hàng = một record, một cột = một field','Loại merge/subtotal/dòng trang trí khỏi vùng dữ liệu','Chuẩn hóa header và kiểu dữ liệu trước phân tích'],
    useCases:['Chuẩn bị dữ liệu cho PivotTable','Nguồn đầu vào Power Query','Bảng nhập liệu hàng ngày','Master data dùng cho lookup'],
    guide:{task:'Bạn cần biến một sheet nhìn đẹp nhưng khó phân tích thành bảng dữ liệu máy có thể đọc ổn định.',tool:'Cấu trúc tabular: header duy nhất + record liên tục',steps:['Xác định vùng dữ liệu thật','Giữ đúng một hàng header','Mỗi cột chỉ chứa một loại thông tin','Mỗi hàng là một record','Bỏ merge, dòng tổng và dòng trống xen giữa dữ liệu','Kiểm tra Date/Number/Text nhất quán'],success:'Filter/Pivot nhận đúng toàn bộ vùng và mỗi cột có ý nghĩa rõ.',mistake:'Đưa tiêu đề báo cáo, dòng Total hoặc merge cell vào cùng vùng dữ liệu nguồn.'},
    sections:[
      sec('1. Một hàng phải là một bản ghi','Nếu một record bị trải qua nhiều hàng, công cụ phân tích không biết đâu là đơn vị dữ liệu.',[
        'Chọn một dòng bất kỳ.','Hỏi: dòng này đang mô tả một Order, một Staff hay một Defect?','Kiểm tra mỗi dòng khác có cùng grain hay không.','Nếu cùng Order_ID xuất hiện nhiều dòng, xác định đó là nhiều line item hay duplicate.'
      ],['“Grain” là mức chi tiết của một dòng. Ví dụ bảng Orders có thể một dòng/đơn; bảng Order Lines có thể nhiều dòng cho một đơn.','Không thể kiểm soát duplicate nếu chưa biết grain.'],{title:'Ví dụ',text:'Nếu bảng là Sales Line, mỗi hàng có thể là một sản phẩm trong đơn hàng — Order_ID lặp là hợp lệ.'},'Đừng kết luận “trùng” chỉ vì một mã lặp nếu grain cho phép lặp.','core'),
      sec('2. Một cột chỉ nên chứa một loại thông tin','Cột càng rõ nghĩa, công thức và query càng bền.',[
        'Đọc từng header.','Nếu một ô kiểu “HN01 - Hà Nội” đang chứa cả mã và tên, quyết định có cần tách hai field hay không.','Không trộn số và text mô tả trong cùng cột metric.','Đặt header duy nhất, không merge header nhiều tầng.'
      ],['Một cột Revenue nên là Number; một cột Date nên là Date; một cột Store_Code nên là Text.','Header nên ngắn, ổn định và không đổi tùy tháng nếu có quy trình refresh.'],{title:'Ví dụ',text:'Tách “NV001 - Nguyễn An” thành STAFF_ID và STAFF_NAME nếu hai field cần dùng độc lập.'},'Header kiểu “Doanh số tháng 8” khiến schema đổi hàng tháng; thường nên có cột Date/Month riêng.','core'),
      sec('3. Loại cấu trúc trình bày ra khỏi vùng dữ liệu','Dữ liệu nguồn và báo cáo trình bày là hai vai trò khác nhau.',[
        'Bỏ Merge Cells trong vùng nguồn.','Xóa/đưa dòng Total ra ngoài bảng nguồn.','Xóa dòng trống xen giữa record.','Đặt title lớn của báo cáo ở sheet khác hoặc phía ngoài vùng Table.','Bật Filter thử để kiểm tra toàn bộ record được nhận.'
      ],['Merge, subtotal và dòng tiêu đề phụ phù hợp với báo cáo trình bày nhưng gây khó cho dữ liệu nguồn.','Nguồn càng “phẳng” thì Pivot/PQ càng ít bước xử lý đặc biệt.'],{title:'PASS khi',text:'Ctrl+Shift+L hoặc Insert Table nhận đúng một vùng liên tục với một hàng header.'},'Đừng giữ “dòng tổng cuối bảng” trong nguồn rồi lại Pivot — rất dễ bị double count.','core',[q('Dòng Total thủ công trong nguồn Pivot có rủi ro gì?',['Double count','Đổi font','Mất màu','Không lưu được file'],0,'Pivot sẽ cộng cả chi tiết và dòng Total nếu bạn đưa cả hai vào nguồn.')]),
      sec('4. Học thêm: thiết kế schema bền cho dữ liệu lặp','Dùng khi file được cập nhật nhiều kỳ/tháng.',[
        'Giữ tên cột ổn định giữa các file.','Đưa Month/Year thành dữ liệu trong cột thay vì tên cột.','Chọn key rõ ràng.','Document đơn vị đo và kiểu dữ liệu.'
      ],['Schema ổn định giúp Append/Combine Folder và automation ít lỗi hơn.','Thiết kế nguồn tốt thường tiết kiệm nhiều công sức hơn việc sửa query về sau.'],{title:'Nguyên tắc',text:'Schema ổn định > format đẹp trong sheet nguồn.'},null,'extension')
    ]
  });

  replace('s07-logic',{
    hook:'Bạn cần gắn nhãn “Đạt” khi doanh thu ≥ target và tỷ lệ lỗi ≤ 2%. Thay vì học IF như cú pháp, bài này bắt đầu từ rule công việc rồi biến nó thành điều kiện có thể kiểm tra.',
    outcomes:['Tách rule nghiệp vụ thành điều kiện TRUE/FALSE','Viết IF một nhánh và nhiều điều kiện','Chọn đúng AND/OR','Test boundary trước khi kéo công thức'],
    useCases:['Đạt/Không đạt KPI','Cảnh báo đơn bất thường','Kiểm tra hồ sơ đủ điều kiện','Gắn trạng thái PASS/WARN/FAIL'],
    guide:{task:'Bạn cần biến một quy định “nếu… thì…” thành công thức dễ kiểm tra.',tool:'Biểu thức TRUE/FALSE → IF → AND/OR',steps:['Viết rule bằng tiếng Việt ngắn gọn','Tách từng điều kiện','Test điều kiện riêng để xem TRUE/FALSE','Đưa điều kiện vào IF','Test giá trị ngay tại ngưỡng','Sau đó mới kéo công thức'],success:'Các case dưới ngưỡng, đúng ngưỡng và trên ngưỡng đều trả đúng trạng thái.',mistake:'Viết IF lồng dài trước khi kiểm tra từng điều kiện.'},
    sections:[
      sec('1. Test điều kiện trước khi viết IF','Nếu biểu thức logic chưa đúng thì IF chỉ che thêm một lớp khó debug.',[
        'Giả sử Revenue ở B2, Target ở C2.','Tại ô trống gõ =B2>=C2.','Kiểm tra kết quả TRUE/FALSE ở vài dòng.','Thử case B2 đúng bằng C2.'
      ],['Toán tử >= khác > ở đúng điểm biên. Đây là lỗi nghiệp vụ phổ biến.','Text cần đặt trong dấu nháy kép, ví dụ D2="PASS".'],{title:'Ví dụ',formula:'=B2>=C2',text:'TRUE nghĩa là Revenue đạt hoặc vượt Target.'},'Boundary phải được test riêng; đừng chỉ thử một case rất cao và một case rất thấp.','core',[q('Nếu rule là “từ 100 trở lên”, toán tử đúng là?',['>','>=','<','<>'],1,'“Từ 100 trở lên” bao gồm chính 100 nên dùng >=.')]),
      sec('2. Đổi TRUE/FALSE thành trạng thái bằng IF','IF chỉ nên làm một việc rõ ràng: trả kết quả theo điều kiện.',[
        'Dùng lại điều kiện đã test.','Gõ =IF(B2>=C2,"Đạt","Chưa đạt").','Enter.','Kéo xuống vài dòng.','So với rule ban đầu.'
      ],['Cú pháp IF là điều kiện, kết quả khi đúng, kết quả khi sai.','Nếu nhánh trả về text, đặt text trong dấu nháy kép.'],{title:'Ví dụ',formula:'=IF(B2>=C2,"Đạt","Chưa đạt")',text:'Nhãn trạng thái theo target.'},'Đừng hardcode target trong hàng nghìn công thức nếu target nằm sẵn trong bảng/config.','core'),
      sec('3. AND hay OR? Hãy đọc lại câu nghiệp vụ','Từ “và” với “hoặc” quyết định logic.',[
        'Rule: Revenue đạt target VÀ NG Rate ≤2%.','Test Revenue>=Target riêng.','Test NG_Rate<=2% riêng.','Kết hợp AND hai điều kiện.','Bọc trong IF để trả PASS/FAIL.'
      ],['AND chỉ TRUE khi mọi điều kiện đều đúng. OR TRUE khi ít nhất một điều kiện đúng.','Một rule cảnh báo thường dùng OR: chỉ cần một dấu hiệu bất thường là bật cảnh báo.'],{title:'Ví dụ',formula:'=IF(AND(B2>=C2,D2<=2%),"PASS","FAIL")',text:'Cả doanh thu và chất lượng cùng đạt mới PASS.'},'AND/OR sai có thể làm tỷ lệ PASS thay đổi rất lớn nhưng công thức vẫn không báo lỗi.','core',[q('Cảnh báo nếu Revenue thấp HOẶC tồn kho âm nên dùng?',['AND','OR','SUM','MATCH'],1,'Chỉ một điều kiện xấu đã đủ cảnh báo nên dùng OR.')]),
      sec('4. Học thêm: tránh IF lồng quá sâu','Rule nhiều mức thường dễ bảo trì hơn khi tách thành bảng cấu hình.',[
        'Nếu có 6–10 mức xếp loại, liệt kê các ngưỡng ra bảng.','Xem có thể dùng lookup theo bảng ngưỡng hay không.','Nếu vẫn dùng IF/IFS, test từng boundary.','Ghi rõ thứ tự ưu tiên rule.'
      ],['IF lồng quá sâu khó đọc và dễ sai khi nghiệp vụ đổi.','Quy tắc là dữ liệu thì nên cân nhắc đưa ra Config thay vì chôn trong formula.'],{title:'Nguyên tắc',text:'Rule thay đổi thường xuyên → ưu tiên bảng config + lookup.'},null,'extension')
    ]
  });

  replace('s10-text',{
    hook:'Bạn có mã “  HN01-ABC  ”, tên nhập thừa khoảng trắng và chuỗi cần tách trước khi lookup. Bài này chỉ tập trung vào các thao tác làm sạch text dùng nhiều nhất.',
    outcomes:['Phân biệt khoảng trắng nhìn thấy và ký tự ẩn','Dùng TRIM/CLEAN đúng mục đích','Tách/lấy phần chuỗi bằng LEFT/RIGHT/MID hoặc hàm mới nếu có','Nối chuỗi để tạo key có kiểm soát'],
    useCases:['Chuẩn hóa mã nhân viên/cửa hàng','Làm sạch dữ liệu copy từ web/ERP','Tách prefix/suffix','Tạo key ghép để đối soát'],
    guide:{task:'Bạn cần làm sạch chuỗi trước khi lookup hoặc phân tích.',tool:'TRIM · CLEAN · LEFT/RIGHT/MID · TEXTSPLIT/TEXTBEFORE/TEXTAFTER tùy phiên bản',steps:['Giữ cột Original','Tạo cột Clean bên cạnh','Dùng TRIM/CLEAN theo loại lỗi','Kiểm tra LEN trước/sau','Tách chuỗi nếu cần','So một số mẫu rồi mới dùng cột Clean cho lookup'],success:'Chuỗi sạch có độ dài/format nhất quán và lookup match đúng.',mistake:'Ghi đè dữ liệu gốc ngay khi chưa biết ký tự lỗi nằm ở đâu.'},
    sections:[
      sec('1. TRIM và CLEAN xử lý hai loại lỗi khác nhau','Dữ liệu copy từ hệ thống có thể chứa khoảng trắng hoặc ký tự điều khiển không nhìn thấy.',[
        'Tại cột phụ nhập =LEN(A2).','Dùng =TRIM(A2) ở cột Clean.','Nếu vẫn lỗi, thử =CLEAN(TRIM(A2)).','So LEN của Original và Clean.','Kiểm tra lookup lại bằng Clean.'
      ],['TRIM loại khoảng trắng thừa thông thường và giữ một khoảng giữa từ. CLEAN loại nhiều ký tự điều khiển không in được.','Một số khoảng trắng đặc biệt như CHAR(160) cần SUBSTITUTE trước TRIM.'],{title:'Ví dụ',formula:'=TRIM(CLEAN(A2))',text:'Làm sạch nhiều trường hợp text copy có ký tự thừa.'},'TRIM không giải quyết mọi loại non-breaking space; nếu vẫn lệch hãy kiểm tra CODE/UNICODE hoặc SUBSTITUTE.','core'),
      sec('2. Tách mã theo cấu trúc cố định','Chọn công cụ theo cấu trúc chuỗi, không theo thói quen.',[
        'Xác định cần lấy trước/sau delimiter hay theo vị trí cố định.','Nếu mã luôn 4 ký tự đầu, dùng LEFT.','Nếu cần phần sau dấu -, dùng TEXTAFTER trên Excel mới hoặc FIND/MID trên Excel cũ.','Kiểm tra vài chuỗi có độ dài khác nhau.'
      ],['LEFT/RIGHT phù hợp khi số ký tự ổn định. MID + FIND linh hoạt hơn khi delimiter nằm ở vị trí thay đổi.','TEXTBEFORE/TEXTAFTER/TEXTSPLIT giúp công thức dễ đọc hơn trên Microsoft 365 hỗ trợ.'],{title:'Ví dụ',formula:'=LEFT(A2,4)',text:'Lấy 4 ký tự đầu của mã.'},'Đừng dùng LEFT(A2,4) nếu mã phần đầu có độ dài thay đổi.','core',[q('Nếu cần phần nằm sau dấu “-” trên Excel mới, hàm phù hợp là?',['TEXTAFTER','SUMIFS','ROUND','COUNT'],0,'TEXTAFTER trả phần chuỗi sau delimiter.')]),
      sec('3. Nối text để tạo key nhưng phải có delimiter','Key ghép không có delimiter dễ tạo collision.',[
        'Giả sử Store ở B2 và Staff ở C2.','Tạo key =B2&"|"&C2.','Kiểm tra key có blank hay ký tự | trong dữ liệu gốc không.','Dùng key để COUNTIF/lookup khi nghiệp vụ thật sự cần tổ hợp hai trường.'
      ],['Ghép AB + C và A + BC đều thành ABC nếu không có delimiter. Dùng ký tự phân tách giảm rủi ro collision.','Key ghép chỉ nên dùng nếu tổ hợp trường đó có ý nghĩa duy nhất trong nghiệp vụ.'],{title:'Ví dụ',formula:'=B2&"|"&C2',text:'Tạo key Store|Staff rõ ràng.'},'Nếu một thành phần key có blank, cần quyết định blank đó có hợp lệ hay phải đưa vào exception.','core'),
      sec('4. Học thêm: chuẩn hóa text có thể tái sử dụng','Khi cùng bước clean lặp hàng tháng, cân nhắc Power Query.',[
        'Liệt kê chuỗi bước clean đang lặp.','Nếu tháng nào cũng TRIM/Replace/Split giống nhau, chuyển sang Power Query.','Giữ cột nguồn và kiểm tra row count trước/sau.','Document rule thay thế.'
      ],['Formula phù hợp cho xử lý cục bộ/nhanh. Power Query phù hợp khi pipeline làm sạch lặp đi lặp lại.'],{title:'Quy tắc chọn',text:'Làm một lần nhỏ → Formula; lặp lại theo kỳ → cân nhắc Power Query.'},null,'extension')
    ]
  });

  replace('s11-date-time',{
    hook:'Bạn lọc “tháng 9” nhưng Excel không nhóm được ngày, SUMIFS theo thời gian ra 0 và Pivot coi ngày như text. Bài này bắt đầu từ việc phân biệt Date thật với chuỗi nhìn giống ngày.',
    outcomes:['Kiểm tra Date thật hay Text','Dùng TODAY/YEAR/MONTH/EOMONTH cho bài toán thường gặp','Lọc/tổng hợp theo khoảng ngày an toàn','Hiểu DateTime để không bỏ sót ngày cuối kỳ'],
    useCases:['Báo cáo theo tháng','Tính tuổi dữ liệu/lead time','Lọc tháng hiện tại','SUMIFS theo khoảng ngày'],
    guide:{task:'Bạn cần tổng hợp đúng dữ liệu theo ngày/tháng.',tool:'Date serial + YEAR/MONTH/EOMONTH + criteria ngày',steps:['Kiểm tra kiểu dữ liệu của cột Date','Chuyển Text date thành Date thật nếu cần','Tạo ngày đầu kỳ','Dùng ngày đầu kỳ tiếp theo làm cận trên','Đối chiếu bằng Filter/Pivot'],success:'Excel group theo tháng được và công thức khoảng ngày khớp Filter.',mistake:'So text “01/09/2026” hoặc dùng <= ngày cuối tháng với dữ liệu có cả giờ.'},
    sections:[
      sec('1. Xác nhận ô là Date thật','Excel lưu ngày dưới dạng số serial; format chỉ quyết định cách hiển thị.',[
        'Chọn một ô Date.','Đổi format tạm sang General.','Nếu hiện số serial như 46xxx, đó thường là Date thật.','Thử YEAR(A2); nếu lỗi, kiểm tra dữ liệu gốc.','Không sửa hàng loạt trước khi biết nguồn lỗi.'
      ],['Một chuỗi “11/09/2026” có thể nhìn giống ngày nhưng vẫn là Text.','Pivot/Filter/Date arithmetic chỉ ổn khi kiểu dữ liệu đúng.'],{title:'Kiểm tra',formula:'=ISNUMBER(A2)',text:'TRUE thường cho thấy Excel đang lưu Date như Number serial.'},'Locale dd/mm và mm/dd có thể làm chuyển đổi text date sai ngày.','core'),
      sec('2. Tạo mốc đầu tháng và cuối tháng đúng cách','Mốc thời gian rõ giúp công thức báo cáo dễ kiểm tra.',[
        'Giả sử ngày bất kỳ ở A2.','Dùng =DATE(YEAR(A2),MONTH(A2),1) để lấy đầu tháng.','Dùng =EOMONTH(A2,0) để lấy ngày cuối tháng.','Nếu cần tháng sau, dùng =EDATE(đầu_tháng,1).'
      ],['DATE/YEAR/MONTH giúp xây mốc ngày không phụ thuộc format hiển thị.','EOMONTH rất hữu ích cho kỳ báo cáo.'],{title:'Ví dụ',formula:'=EOMONTH(A2,0)',text:'Trả ngày cuối tháng chứa A2.'},null,'core'),
      sec('3. Tổng hợp DateTime không bỏ sót ngày cuối kỳ','Nếu cột có cả giờ, điều kiện <= ngày cuối tháng 00:00 có thể bỏ sót giao dịch trong ngày đó.',[
        'Tạo StartDate = ngày đầu tháng.','Tạo NextMonth = ngày đầu tháng sau.','Dùng Date >= StartDate.','Dùng Date < NextMonth.','Filter cùng khoảng để đối chiếu.'
      ],['Mẫu >= đầu kỳ và < đầu kỳ sau hoạt động tốt cho cả Date và DateTime.','Đây là pattern nên dùng trong SUMIFS, COUNTIFS và Power Query filter.'],{title:'Ví dụ',formula:'=SUMIFS($H:$H,$A:$A,">="&F1,$A:$A,"<"&EDATE(F1,1))',text:'Tổng H cho toàn tháng bắt đầu tại F1.'},'Đừng dùng TEXT(Date,"mm") để lọc khối lượng lớn nếu có thể dùng khoảng Date thật.','core',[q('Với DateTime, điều kiện cận trên an toàn cho tháng là?',['< ngày đầu tháng sau','= ngày cuối tháng','<= ngày đầu tháng','Text month'],0,'< ngày đầu tháng sau bao trọn mọi thời điểm trong tháng hiện tại.')]),
      sec('4. Học thêm: số ngày làm việc và kỳ báo cáo','Dùng cho SLA/lead time hoặc kế hoạch công việc.',[
        'Dùng NETWORKDAYS cho số ngày làm việc.','Chuẩn bị danh sách Holiday nếu cần.','Kiểm tra ngày bắt đầu/kết thúc có tính hay không theo nghiệp vụ.','Không dùng WORKDAY/NETWORKDAYS nếu ca làm việc phức tạp mà chưa có calendar phù hợp.'
      ],['Ngày làm việc phụ thuộc lịch thực tế. Danh sách holiday và weekend pattern phải được quản lý như dữ liệu cấu hình.'],{title:'Ví dụ',formula:'=NETWORKDAYS(A2,B2,$H$2:$H$30)',text:'Đếm ngày làm việc giữa A2 và B2, loại ngày nghỉ trong H2:H30.'},null,'extension')
    ]
  });

  replace('a13-excel-table',{
    hook:'Bạn thêm 200 dòng dữ liệu mới nhưng công thức, Pivot nguồn và Data Validation không tự mở rộng. Excel Table giải quyết việc vùng dữ liệu “biết tự lớn lên” nếu dùng đúng.',
    outcomes:['Chuyển vùng dữ liệu chuẩn thành Table','Hiểu header/total row/structured reference','Biết Table tự mở rộng khi thêm dòng','Dùng Table làm nguồn bền hơn cho Pivot và công thức'],
    useCases:['Bảng nhập liệu cập nhật mỗi ngày','Nguồn PivotTable','SUMIFS/XLOOKUP với structured references','Nguồn Power Query trong workbook'],
    guide:{task:'Bạn cần vùng dữ liệu tự mở rộng khi thêm dòng mới.',tool:'Insert → Table hoặc Ctrl+T',steps:['Bảo đảm vùng có một hàng header và không merge','Chọn một ô trong vùng','Nhấn Ctrl+T','Xác nhận My table has headers','Đặt tên Table dễ hiểu','Nhập một dòng mới phía dưới và kiểm tra Table tự mở rộng'],success:'Dòng mới nhận format/công thức và nằm trong Table mà không phải sửa range tay.',mistake:'Tạo Table trên vùng có dòng Total, merge hoặc header nhiều tầng.'},
    sections:[
      sec('1. Chỉ tạo Table khi nguồn đã tabular','Table không sửa được cấu trúc nguồn sai.',[
        'Kiểm tra một hàng header.','Bỏ merge trong vùng nguồn.','Bỏ dòng Total thủ công.','Bảo đảm mỗi hàng là một record.','Sau đó mới Ctrl+T.'
      ],['Table hoạt động tốt nhất trên dữ liệu phẳng, liên tục và header duy nhất.','Nếu nguồn chưa sạch, sửa cấu trúc trước khi biến thành Table.'],{title:'PASS khi',text:'Ctrl+T nhận đúng toàn bộ record và header không bị sinh Column1/Column2 bất ngờ.'},null,'core'),
      sec('2. Đặt tên Table và kiểm tra tự mở rộng','Tên rõ giúp công thức và query dễ đọc hơn.',[
        'Chọn Table.','Table Design → Table Name.','Đổi tên ví dụ tblSales.','Thêm một dòng ngay dưới Table.','Kiểm tra Table mở rộng và formula column tự fill nếu có.'
      ],['Tên Table như tblSales/tblStaffMaster tốt hơn Table1/Table2 khi workbook có nhiều nguồn.','Khi nhập tiếp dòng liền kề, Table thường tự mở rộng và giữ công thức/format.'],{title:'Ví dụ',text:'tblSales tự nhận dòng mới, nên Pivot/PQ tham chiếu Table không cần sửa địa chỉ $A$1:$H$5000.'},'Nếu bạn dán dữ liệu cách Table một dòng trống, Table có thể không tự mở rộng như mong muốn.','core'),
      sec('3. Đọc structured reference thay vì sợ cú pháp','Structured reference mô tả tên cột nên dễ audit hơn địa chỉ dài.',[
        'Trong Table, thêm cột Amount.','Gõ =[@Qty]*[@Price].','Enter.','Quan sát Excel tự điền toàn cột.','Thử SUM(tblSales[Revenue]) ở ô ngoài Table.'
      ],['[@Qty] nghĩa là Qty ở dòng hiện tại. tblSales[Revenue] nghĩa là toàn bộ data column Revenue của tblSales.','Tên cột rõ làm công thức dễ đọc hơn trong workbook dữ liệu lớn.'],{title:'Ví dụ',formula:'=[@Qty]*[@Price]',text:'Tính theo dòng hiện tại trong Table.'},'Đổi tên header sẽ làm structured reference đổi theo; tránh tên header quá dài hoặc thay đổi tùy kỳ.','core',[q('[@Qty] trong Table nghĩa là?',['Toàn bộ cột Qty','Qty của dòng hiện tại','Ô Qty đầu tiên','Tên Sheet Qty'],1,'Ký hiệu @ chỉ dòng hiện tại trong structured reference.')]),
      sec('4. Học thêm: khi nào không nên ép dùng Table','Table là công cụ tốt nhưng không phải mọi output đều cần Table.',[
        'Dùng Table cho nguồn/input có record liên tục.','Không cần biến mọi vùng dashboard trình bày thành Table.','Với spill Dynamic Array, kiểm tra tương thích trước vì spill không chạy bên trong Table theo cách thông thường.','Giữ output trình bày tách khỏi data layer.'
      ],['Tách Data layer và Report layer giúp workbook dễ bảo trì. Table chủ yếu mạnh ở data layer.'],{title:'Nguyên tắc',text:'Input/Data → ưu tiên Table; Dashboard layout → không ép Table nếu không cần.'},null,'extension')
    ]
  });
})();
