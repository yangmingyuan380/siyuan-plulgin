import { EChartsType, init } from 'echarts';
import chartCss from '../css/chartCss';
import { getData } from './siyuanApi';
import { Dialog } from 'siyuan';
// 将日期转换为字符串格式 2023-01-01
function dateToStr(currentDay: Date): string {
    let str: string = currentDay.getFullYear() + "-";
    let month = currentDay.getMonth() + 1;
    let day = currentDay.getDate();
    if (month < 10) {
        str += "0" + month;
    } else {
        str += month;
    }
    str += "-";
    if (day < 10) {
        str += "0" + day;
    } else {
        str += day;
    }
    return str;
}

function getDateList(dataList: any[], year: number): any[][] {
    // 定义一个结果数组
    let result: any[][] = new Array();
    // 定义一个对象或Map来存储每个日期在结果数组中的索引
    let indexMap: Map<string, number> = new Map();
    let firstDay: Date = new Date(year, 0, 1);
    let lastDay: Date = new Date(year, 11, 31);
    let currentDay: Date = firstDay;
    let i: number = 0;
    // 遍历前360天，将每个日期添加到结果数组和索引对象或Map中
    while (currentDay <= lastDay) {
        // 获取日期字符串，例如"2023-02-01"
        let dateStr = dateToStr(currentDay);
        // 将日期字符串和初始值0作为一个元素添加到结果数组中
        result.push([dateStr, 0]);
        // 将日期字符串和对应的索引添加到索引对象或Map中
        indexMap.set(dateStr, i);
        i++;
        // currentDay 天数加1
        currentDay.setDate(currentDay.getDate() + 1);
    }
    // 遍历数据列表，将每个对象的created属性值转换为日期格式，并更新结果数组中对应元素的第二个值
    for (let obj of dataList) {
        // 转换日期格式，例如"2023-02-01"
        let date = obj.created.slice(0, 4) + "-" + obj.created.slice(4, 6) + "-" + obj.created.slice(6, 8);
        // 获取该日期在结果数组中的索引
        let index: number | undefined = indexMap.get(date);
        // 如果该索引存在，则增加结果数组中对应元素的第二个值
        if (index !== undefined) {
            result[index][1]++;
        }
    }
    console.log("结果：", result)
    return result;
}

function plotActiveGraph(newDiv: HTMLDivElement, year: number) {
    console.log('year:', year)
    chartCss.setcss(newDiv)
    //{locale:'ZH'}：使用echarts的中文编码
    const myChart: EChartsType = init(newDiv, undefined, { locale: 'ZH' });
    let option = {
        //鼠标移入图时，通过hover效果显示每一天的日期和活跃度
        tooltip: {
            formatter(params) {
                return `${params.data[0]},` + `\n` + `
                活跃度：${params.data[1]}`;
            },
        },
        visualMap: {
            //是否显示图上面的示例
            show: false,
            min: 0,
            max: 400,
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            top: 10,
            pieces: [      // 自定义每一段的范围，以及每一段的文字
                { gte: 15, color: 'blue' }, // 不指定 max，表示 max 为无限大（Infinity）。
                { gte: 5, lte: 10, color: 'rgb(98,155,223)' },
                { gte: 3, lte: 5, color: 'rgb(167,213,255)' },
                { gte: 1, lte: 3, color: 'rgb(214,233,250)' },
                { lte: 0, color: 'rgb(238,238,238)' }],
        },
        calendar: {
            top: 40,
            left: 30,
            right: 30,
            width: 800,
            height: 115,
            cellSize: 25,
            splitLine: false,
            range: [new Date(year, 0, 1), new Date(year, 11, 31)],
            itemStyle: {
                borderWidth: 0.5,
                borderColor: 'black',
                normal: {
                    borderWidth: 3,
                    borderColor: 'rgb(255, 255, 255)'
                }
            },
            yearLabel: { show: false }
        },
        series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: <any>[]
        }
    };
    option && myChart.setOption(option);

    myChart.showLoading();
    getData(year).then((data: any[]) => {
        myChart.hideLoading();
        option.series.data = getDateList(data, year);
        myChart.setOption(option);
    });
}

export function showActiveGraph() {
    new Dialog({
        title: '活跃图',
        content: `
        <div>
          <select id="plugin-chartyear">
          </select>
          <div id="plugin-chart">
          </div>
        </div>
        `,
        width: '70vw',
        height: '50vh',
    });
    setTimeout(() => {
        // 年份选择器
        let selectEl: HTMLSelectElement = document.getElementById('plugin-chartyear') as HTMLSelectElement;
        let currentYear: number = new Date().getFullYear();
        let defultOption = new Option(String(currentYear), String(currentYear), true);
        selectEl.add(defultOption); // 默认选择
        // 选择器添加选项
        for (let i:number = 2000; i < currentYear; i++) {
            let newOption = new Option(String(i), String(i));
            selectEl.add(newOption);
        }
        let chartEl:HTMLDivElement = document.getElementById('plugin-chart') as HTMLDivElement;
        plotActiveGraph(chartEl, +selectEl.value);
        selectEl.onchange = () => {
            plotActiveGraph(chartEl, +selectEl.value);
        }
    })
}