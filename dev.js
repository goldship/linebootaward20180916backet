window.onload = function (e) {
    liff.init(function (data) {
        initialize(data.context.userId, data_summary);
    });

    // local debug
    // if (!liff.init.length){
        // var data = [];
        // data['context'] = [];
        // // data['context']['userId'] = '';
        // data['context']['userId'] = 'U0a9846157392255ca6105b017a067406';
        // initialize(data.context.userId, data_summary);
    // }

};
   
function draw_chart(labels,pointData) 
{
    var options = {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              userCallback: function(label, index, labels) {
                if (Math.floor(label) === label) {
                  return label;
                }
              }
            }
          }]
        }
      };

    var ctx = document.getElementById("point_chart");
    var c = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
                label: 'ポイント',
                data: pointData,
                borderColor: '#53B535',
                backgroundColor: '#53B535',
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 5
            }]
        },
        options : options
    });
}

function sum(arr) {
    var sum = 0;
    for (var i=0,len=arr.length; i<len; ++i) {
        sum += arr[i];
    };
    return sum;
}

function initialize(user_id, callback) {
    const res = new XMLHttpRequest();
    res.open("GET", 'https://4piah5ish8.execute-api.ap-northeast-1.amazonaws.com/prod?user_id=' + user_id);
    res.addEventListener("load", (event) => {
        callback(event);
    });
    res.addEventListener("error", () => {
        console.error("error");
    });
    res.send();
}

function data_summary(event){
    // console.log(event);

    if (event.target.status !== 200) {
        console.log(`${event.target.status}: ${event.target.statusText}`);
        return;
    }
    var response = JSON.parse(event.target.responseText);
    if (! response.body) {
        console.log('response body is null');
        return;
    }

    var data = response.body;
    // console.log(data.points);


    // 日付でサマリ
    var labels = [];
    var point_data = [];
    var point = 0;
    for (var i=0; i < data.points.length; i++) {
        // ラベル
        labels.push(data.points[i].date);

        // ポイント(推移を表すため足す)
        point = point + data.points[i].point;
        point_data.push(point);
    }

    console.log(labels);
    console.log(point_data);
    if (!labels || ! point_data){
        return;
    }


    // チャートに表示する直近の日数
    var _point_data = [];
    const SHOW_DAY = 7;
    if (labels.length > SHOW_DAY){
        var start_index = labels.length - SHOW_DAY;
        labels = labels.slice(start_index);
        // console.log(start_index);
        for (var i= start_index; i < point_data.length; i++) {
            _point_data.push(point_data[i]); 
        }

        console.log(labels);
        console.log(_point_data);
    }else{
        _point_data = point_data;
    }
    draw_chart(labels,_point_data);

    // 合計ポイント
    if (data.meta[0]){
        document.getElementById("point_total").innerText = (data.meta[0].points || 0);
    }

}
 