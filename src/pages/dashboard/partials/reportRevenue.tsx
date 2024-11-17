import React, { useContext, useEffect, useState } from "react";
import SelectCustom from "components/selectCustom/selectCustom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { dateFilter, typeCalendar } from "model/dashboard/response/DashboardModelResponse";
import moment from "moment";
import { ContextType, UserContext } from "contexts/userContext";
import { useWindowDimensions } from "utils/hookCustom";
import { ReportDashboardProps } from "model/dashboard/PropsModel";
moment.locale("vi");

export default function ReportRevenue(props: ReportDashboardProps) {
  const { isCollapsedSidebar } = useContext(UserContext) as ContextType;
  const { width } = useWindowDimensions();
  const { classNames, data, handleFilterDate } = props;
  const [paramRevenue, setParamRevenue] = useState<any>({
    type_time: typeCalendar.today,
    from_date: moment().format("DD/MM/yyyy"),
    to_date: moment().format("DD/MM/yyyy"),
  });

  const categoriesRevenue = [
    `<span style="color: #0070B3; text-transform: capitalize; font-size: 14px; line-height: 16px;">${moment()
      .subtract(6, "days")
      .format("dddd")}</span><br /><i style="font-size: 12px; line-height: 14px;">${moment().subtract(6, "days").format("DD/MM/yyyy")}</i>`,
    `<span style="color: #0070B3; text-transform: capitalize; font-size: 14px; line-height: 16px;">${moment()
      .subtract(5, "days")
      .format("dddd")}</span><br /><i style="font-size: 12px; line-height: 14px;">${moment().subtract(5, "days").format("DD/MM/yyyy")}</i>`,
    `<span style="color: #0070B3; text-transform: capitalize; font-size: 14px; line-height: 16px;">${moment()
      .subtract(4, "days")
      .format("dddd")}</span><br /><i style="font-size: 12px; line-height: 14px;">${moment().subtract(4, "days").format("DD/MM/yyyy")}</i>`,
    `<span style="color: #0070B3; text-transform: capitalize; font-size: 14px; line-height: 16px;">${moment()
      .subtract(3, "days")
      .format("dddd")}</span><br /><i style="font-size: 12px; line-height: 14px;">${moment().subtract(3, "days").format("DD/MM/yyyy")}</i>`,
    `<span style="color: #0070B3; text-transform: capitalize; font-size: 14px; line-height: 16px;">${moment()
      .subtract(2, "days")
      .format("dddd")}</span><br /><i style="font-size: 12px; line-height: 14px;">${moment().subtract(2, "days").format("DD/MM/yyyy")}</i>`,
    `<span style="color: #0070B3; text-transform: capitalize; font-size: 14px; line-height: 16px;">${moment()
      .subtract(1, "days")
      .format("dddd")}</span><br /><i style="font-size: 12px; line-height: 14px;">${moment().subtract(1, "days").format("DD/MM/yyyy")}</i>`,
    `<span style="color: #0070B3; text-transform: capitalize; font-size: 14px; line-height: 16px;">${moment().format(
      "dddd"
    )}</span><br /><i>${moment().format("DD/MM/yyyy")}</i>`,
  ];

  const [chartRevenue, setChartRevenue] = useState({
    chart: {
      type: "column",
      style: {
        fontFamily: "Roboto",
      },
      margin: [40, 0, 40],
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      lineWidth: 1,
      tickWidth: 0,
      title: {
        align: "high",
        offset: 0,
        text: "Triệu VNĐ",
        rotation: 0,
        y: -20,
        style: {
          color: "#0070B3",
          fontStyle: "italic",
          fontSize: "12px",
          lineHeight: "14px",
        },
      },
      labels: {
        formatter: (value) => {
          return value.value / 1000000 + "";
        },
        style: {
          fontSize: "1.4rem",
        },
      },
    },
    xAxis: {
      useHtml: true,
      categories: categoriesRevenue,
      labels: {
        style: {
          fontSize: "1.4rem",
        },
      },
    },
    legend: {
      enabled: false,
      title: {
        text: "Doanh thu",
      },
    },
    tooltip: {
      headerFormat: "",
      pointFormat: "{series.name}: <strong>{point.y}</strong> VNĐ",
      useHTML: true,
    },
    series: [{ name: "Doanh thu", data: data, color: "#0070B3" }],
  });

  const changeFilterDate = (value: string) => {
    const stateNew = handleFilterDate(value, paramRevenue);
    setParamRevenue({
      ...paramRevenue,
      ...stateNew,
    });
  };

  useEffect(() => {
    if (width < 767 && chartRevenue.chart.type === "column") {
      setChartRevenue({
        ...chartRevenue,
        chart: {
          ...chartRevenue.chart,
          type: "bar",
          margin: [10, 0, 50],
        },
        yAxis: {
          ...chartRevenue.yAxis,
          title: {
            ...chartRevenue.yAxis.title,
            y: 30,
          },
        },
      });
    }
  }, [width]);

  useEffect(() => {
    setTimeout(() => {
      Highcharts.charts?.forEach((chart) => chart?.setSize());
    }, 500);
  }, [isCollapsedSidebar]);

  return (
    <div className={`card-box report-revenue${classNames ? ` ${classNames}` : ""}`}>
      <div className="title d-flex align-items-start justify-content-between">
        <h2>Báo cáo doanh thu</h2>
        <div className="report-filter d-flex align-items-center">
          <SelectCustom
            options={dateFilter}
            value={paramRevenue.type_time}
            name="type_time"
            isSearchable={false}
            fill={true}
            onChange={(e) => changeFilterDate(e.value)}
          />
        </div>
      </div>
      <div className="chart-revenue">
        <HighchartsReact highcharts={Highcharts} options={chartRevenue} />
      </div>
    </div>
  );
}
