import React from 'react'
import * as d3 from "d3"
import 'bootstrap/dist/css/bootstrap.css'

import { Row, Col, Container} from 'react-bootstrap'
import ScatterPlot from '../components/ScatterPlot'
import BarChart from '../components/BarChart'


const csvUrl = 'https://gist.githubusercontent.com/hogwild/3b9aa737bde61dcb4dfa60cde8046e04/raw/citibike2020.csv'

function useData(csvPath){
    const [dataAll, setData] = React.useState(null);
    React.useEffect(()=>{
        d3.csv(csvPath).then(data => {
            data.forEach(d => {
                d.start = +d.start;
                d.tripdurationS = +d.tripdurationS;
                d.end = +d.end;
                d.tripdurationE = +d.tripdurationE;
            });
            setData(data);
        });
    }, []);
    return dataAll;
}

const Charts = () => {
    const [month, setMonth] = React.useState('4'); // 默认月份: '4' => May
    const dataAll = useData(csvUrl);

    if (!dataAll) {
        return <pre>Loading...</pre>;
    }

    const WIDTH = 600;
    const HEIGHT = 400;
    const margin = { top: 20, right: 20, bottom: 20, left: 35 };
    const innerHeightScatter = HEIGHT - margin.top - margin.bottom;
    const innerHeightBar = HEIGHT - margin.top - margin.bottom - 120;
    const innerWidth = WIDTH - margin.left - margin.right;

    const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // 根据所选月份过滤数据
    const data = dataAll.filter(d => d.month === MONTH[month]);

    // 1. 散点图用到的比例尺
    const xScaleScatter = d3.scaleLinear()
        .domain([0, d3.max(dataAll, d => d.tripdurationS)])
        .range([0, innerWidth])
        .nice();

    const yScaleScatter = d3.scaleLinear()
        .domain([0, d3.max(dataAll, d => d.tripdurationE)])
        .range([innerHeightScatter, 0])
        .nice();

    // 2. Task 6: 为柱状图定义 xScaleBar 和 yScaleBar
    //    提示：柱状图 X 轴用车站名称 station 作刻度，所以使用 scaleBand()
    //          柱状图 Y 轴可以使用 tripdurationE (或你想展示的度量)
    //    这里以 tripdurationE 为例，且对所有 station 直接画柱子（不聚合）
    const xScaleBar = d3.scaleBand()
        .domain(data.map(d => d.station)) // station 名称作为刻度
        .range([0, innerWidth])
        .padding(0.1);

    const yScaleBar = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.tripdurationE)])
        .range([innerHeightBar, 0])
        .nice();

    // 改变滑动条时，更新 month
    const changeHandler = (event) => {
        setMonth(event.target.value);
        console.log('Selected month index:', event.target.value);
    };

    return (
        <Container>
            <Row>
                <Col lg={3} md={2}>
                    <input
                        key="slider"
                        type='range'
                        min='0'
                        max='11'
                        value={month}
                        step='1'
                        onChange={changeHandler}
                    />
                    <input
                        key="monthText"
                        type="text"
                        value={MONTH[month]}
                        readOnly
                    />
                </Col>
            </Row>
            <Row className='justify-content-md-center'>
                <Col>
                    <ScatterPlot
                        svgWidth={WIDTH}
                        svgHeight={HEIGHT}
                        marginLeft={margin.left}
                        marginTop={margin.top}
                        data={data}
                        xScale={xScaleScatter}
                        yScale={yScaleScatter}
                    />
                </Col>
                <Col>
                    {/* 取消注释，启用 BarChart */}
                    <BarChart
                        svgWidth={WIDTH}
                        svgHeight={HEIGHT}
                        marginLeft={margin.left}
                        marginTop={margin.bottom}
                        data={data}
                        xScale={xScaleBar}
                        yScale={yScaleBar}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default Charts;
