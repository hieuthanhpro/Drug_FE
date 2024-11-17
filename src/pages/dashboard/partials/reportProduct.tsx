import React, { useContext, useEffect, useState } from "react";
import SelectCustom from "components/selectCustom/selectCustom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { dateFilter, typeCalendar } from "model/dashboard/response/DashboardModelResponse";
import moment from "moment";
import { ContextType, UserContext } from "contexts/userContext";
import { useWindowDimensions } from "utils/hookCustom";
import { ReportDashboardProps } from "model/dashboard/PropsModel";
import { typeFilterSelling } from "model/dashboard/DataModelInitial";

export default function ReportProduct(props: ReportDashboardProps) {
  const { classNames, data, handleFilterDate } = props;
  const { width } = useWindowDimensions();
  const { isCollapsedSidebar } = useContext(UserContext) as ContextType;
  const [filterSellingProduct, setFilterSellingProduct] = useState<any>({
    type: "order",
    type_time: typeCalendar.today,
    from_date: moment().format("DD/MM/yyyy"),
    to_date: moment().format("DD/MM/yyyy"),
  });

  const [chartSellingProduct, setChartSellingProduct] = useState({
    chart: {
      type: "bar",
      height: 600,
      style: {
        fontFamily: "Roboto",
      },
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    yAxis: {
      title: {
        enabled: false,
      },
      labels: {
        style: {
          fontSize: "1.4rem",
        },
      },
      tickInterval: 50,
    },
    plotOptions: {
      bar: {
        stacking: "normal",
        pointWidth: 37,
      },
    },

    xAxis: {
      categories: data.map((item) => item.name),
      labels: {
        style: {
          fontSize: "1.4rem",
        },
      },
      tickInterval: 1,
    },
    legend: {
      enabled: false,
      title: {
        text: typeFilterSelling.find((tfs) => tfs.value === filterSellingProduct.type)?.label,
      },
    },
    tooltip: {
      headerFormat: "",
      pointFormat: "{series.name}: <strong>{point.y}</strong>",
      useHTML: true,
    },
    series: [
      {
        name: typeFilterSelling.find((tfs) => tfs.value === filterSellingProduct.type)?.label,
        data: data.map((item) => item.value),
        color: "#0070B3",
      },
    ],
  });

  useEffect(() => {
    setChartSellingProduct({
      ...chartSellingProduct,
      series: [
        {
          name: typeFilterSelling.find((tfs) => tfs.value === filterSellingProduct.type)?.label,
          data: [380, 350, 220, 190, 165, 120, 85, 65, 50, 50],
          color: "#0070B3",
        },
      ],
    });
  }, [filterSellingProduct]);

  const changeFilterDate = (value: string) => {
    const stateNew = handleFilterDate(value, filterSellingProduct);
    setFilterSellingProduct({
      ...filterSellingProduct,
      ...stateNew,
    });
  };

  useEffect(() => {
    if (width < 767) {
      setChartSellingProduct({
        ...chartSellingProduct,
        chart: {
          ...chartSellingProduct.chart,
          height: 400,
        },
        yAxis: {
          ...chartSellingProduct.yAxis,
        },
        plotOptions: {
          bar: {
            stacking: "normal",
            pointWidth: 24,
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
    <div className={`card-box report-selling-product${classNames ? ` ${classNames}` : ""}`}>
      <div className="title d-flex align-items-start justify-content-between">
        <h2>Top sản phẩm</h2>
        <div className="report-filter d-flex align-items-center">
          <SelectCustom
            options={typeFilterSelling}
            value={filterSellingProduct.type}
            name="type"
            isSearchable={false}
            fill={true}
            onChange={(e) => setFilterSellingProduct({ ...filterSellingProduct, type: e.value })}
          />
          <SelectCustom
            options={dateFilter}
            value={filterSellingProduct.type_time}
            name="type_time"
            isSearchable={false}
            fill={true}
            onChange={(e) => changeFilterDate(e.value)}
          />
        </div>
      </div>
      <div className="chart-selling-product">
        <HighchartsReact highcharts={Highcharts} allowChartUpdate options={chartSellingProduct} />
      </div>
    </div>
  );
}
