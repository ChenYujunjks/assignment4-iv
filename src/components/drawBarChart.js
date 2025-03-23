import * as d3 from "d3";

export let drawBarChart = (barChartLayer, data, xScale, yScale, barChartWidth, barChartHeight) => {
  // 为了让坐标轴更好地呈现，我们可以在这里加上 x、y 轴
  // 也可以在 BarChart 组件里自行添加，视你项目需求而定
  // 下面仅作示例：
  const xAxis = d3.axisBottom(xScale).ticks(data.length);
  const yAxis = d3.axisLeft(yScale).ticks(6);

  // 先清理一下旧的内容，避免重复绘制
  barChartLayer.selectAll("*").remove();

  // x 轴
  barChartLayer
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${barChartHeight})`)
    .call(xAxis)
    // 为 x 轴刻度文字设置角度，避免重叠
    .selectAll("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40) translate(-5,0)");

  // y 轴
  barChartLayer
    .append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  //Task 7: 绘制柱子
  barChartLayer
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", (d) => `bar ${d.station.replace(/[^a-zA-Z]/g, "")}`)
    .attr("x", (d) => xScale(d.station))
    .attr("y", (d) => yScale(d.tripdurationE))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => barChartHeight - yScale(d.tripdurationE))
    .style("fill", "steelblue")
    .on("mouseover", (event, d) => {
      // 1. 当前柱子变红
      d3.select(event.currentTarget).style("fill", "red");

      // 2. 找到与此柱子对应的 station 类名
      const stationClass = d3.select(event.currentTarget)
        .attr("class") // e.g. "bar Jersey3rd"
        .split(" ")     // ["bar", "Jersey3rd"]
        .slice(1)       // ["Jersey3rd"]
        .join(".");     // "Jersey3rd"

      // 3. 选中散点图中对应 station 的 circle 并高亮
      d3.selectAll("circle." + stationClass)
        .attr("r", 10)
        .style("fill", "red")
        .raise(); // 置顶，防止被其他点遮挡
    })
    .on("mouseout", (event, d) => {
      // 1. 恢复当前柱子颜色
      d3.select(event.currentTarget).style("fill", "steelblue");

      // 2. 恢复对应散点
      const stationClass = d3.select(event.currentTarget)
        .attr("class")
        .split(" ")
        .slice(1)
        .join(".");

      d3.selectAll("circle." + stationClass)
        .attr("r", 5)
        .style("fill", "steelblue")
        .lower(); // 将 circle 置于底层
    });
};
