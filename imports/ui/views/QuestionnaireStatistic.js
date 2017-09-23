import {ReactiveVar} from 'meteor/reactive-var';

import {ErrorHandler} from "../errors/ErrorHandler";

import './QuestionnaireStatistic.html'

// const d3 = require('d3');

Template.QuestionnaireStatistic.onCreated(function () {
    this.chartData = new ReactiveVar();

    Meteor.call('callPython', {questionnaireId: FlowRouter.getParam('id'), userId: Meteor.userId()}, (err, data) => {
        if (err) new ErrorHandler(err.reason);

        console.log(data);

        this.chartData.set(data);
    });
});

Template.QuestionnaireStatistic.helpers({
    chartData() {
        return Template.instance().chartData.get();
    },
    drawChart() {
        const chartData = Template.instance().chartData.get();

        if (chartData !== void 0) {
            let data = {
                years: [],
                life_evolution: chartData.life_evolution
            };

            for (let i = chartData.age; i < chartData['life_span']; i++) {
                data.years.push(i);
            }

            const chart = new Chartist.Line('#questionnaire-chart', {
                labels: data.years,
                series: [
                    data.life_evolution
                ]
            }, {
                low: 0,
                showArea: true,
                showPoint: false,
                fullWidth: true,
                seriesBarDistance: 12,
                height: 300
            });

            chart.on('draw', function (data) {
                if (data.type === 'line' || data.type === 'area') {
                    data.element.animate({
                        d: {
                            begin: 2000 * data.index,
                            dur: 2000,
                            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                            to: data.path.clone().stringify(),
                            easing: Chartist.Svg.Easing.easeOutQuint
                        }
                    });
                }
            });
        }
    }
});