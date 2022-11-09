import {GRAPH_TYPES} from "./constants";
import {
    dataFormatter,
    tickFormatter,
    toolTipAfterFooterFormatter,
    toolTipLabelFormatter,
    toolTipTitleFormatter
} from "../utils/dataFormatter";

const defaultOptions = {
    deep: true,
    legend: {
        display: false, position: "bottom", align: "end", labels: {
            usePointStyle: true, padding: 30, color: "blue", fillStyle: "blue"
        }
    },
    responsive: true,
    maintainAspectRatio: false,
    elements: {line: {borderWidth: 2}},
    scales: {
        xAxes: [{
            gridLines: {
                borderDash: [10, 4], zeroLineBorderDash: [10, 4], display: true, drawOnChartArea: true, drawTicks: false
            },
            ticks: {
                fontColor: "#BDBDBD", fontFamily: "Inter", padding: 15
            }
        }],
        yAxes: [{
            scaleLabel: {
                display: false, labelString: "In rupees", fontColor: "#BDBDBD", fontFamily: "Inter"
            },
            gridLines: {
                borderDash: [10, 4], zeroLineBorderDash: [10, 4], display: false
            },
            ticks: {
                callback: tickFormatter, fontColor: "#BDBDBD", fontFamily: "Inter", offsetGridLines: true, beginAtZero: true, stepSize: ''
            },
        }]
    }
};
export const CHART_OPTIONS = {
    [GRAPH_TYPES.BAR]: {
        ...defaultOptions,

        scales: {
            xAxes: [{
                gridLines: {
                    borderDash: [10, 4], zeroLineBorderDash: [10, 4], display: true, drawOnChartArea: false, drawTicks: false

                },
                ticks: {
                    fontColor: "#BDBDBD", fontFamily: "Inter", padding: 15
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: false, labelString: "", fontColor: "#BDBDBD", fontFamily: "Inter"
                },
                gridLines: {
                    display: true, drawOnChartArea: true, drawTicks: false, color: "rgb(224, 224, 224, 0.3)"
                },
                ticks: {
                    callback: tickFormatter, fontColor: "#BDBDBD", fontFamily: "Inter", offsetGridLines: true, beginAtZero: true, padding : 10
                },
            }]
        },
        plugins: {
            datalabels: {
                color: "#41434C", anchor: "end", align: "start", clip: true, formatter: (v) => dataFormatter(v)
            }
        },
        funnel_labels: {
            enabled: true,
            background_color: "#F7F7F7",
            border_color: "#F7F7F7", // sub_text: "ADVANCED",
            text_align: "center",
            rectangle_width_scale_factor: 1.5,
            label_centered: false,
            force_upper_label: false,
            allow_upper_label: true,
            min_width_upper_label: 0,
            font_style: "bold",
            font_color: "#EB5757",
            font_family: "Inter"
        }
    }, [GRAPH_TYPES.LINE]: {
        ...defaultOptions,
        scales: {
            xAxes: [{
                gridLines: {
                    borderDash: [10, 4], zeroLineBorderDash: [10, 4], display: true, drawOnChartArea: true, drawTicks: false
                },
                ticks: {
                    fontColor: "#BDBDBD", fontFamily: "Inter", padding: 15
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: false, labelString: "", fontColor: "#BDBDBD", fontFamily: "Inter"
                },
                gridLines: {
                    borderDash: [10, 4], zeroLineBorderDash: [10, 4], display: false
                },
                ticks: {
                    callback: tickFormatter, fontColor: "#BDBDBD", fontFamily: "Inter", offsetGridLines: true, beginAtZero: true
                },
            }]
        },
        elements: {line: {borderWidth: 2}, point: {radius: 2}},
        tooltips: {
            enabled: true,
            backgroundColor: "#fff",
            bodyFontColor: "#41434C",
            borderColor: '#0000000f',
            borderWidth: 1,
            boxPadding: 2,
            titleFontColor: '#BDBDBD',
            titleFontStyle: 'normal',
            titleFontFamily: 'Inter',
            footerFontColor: '#41434C',
            footerFontStyle: 'normal',
            footerFontWeight: '600',
            footerFontFamily: 'Inter',
            footerFontSize: 14,
            xPadding: 10,
            yPadding: 10,
            titleSpacing: 4,
            callbacks: {
                title: toolTipTitleFormatter,
                footer: toolTipLabelFormatter,
                afterFooter: toolTipAfterFooterFormatter,
                label: () => null,
            }
        }
    }
};