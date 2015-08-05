import React, {Component, PropTypes} from 'react';
import assign from 'object-assign';

const SQUARE_SIZE = 12;
const SQUARE_STYLE = {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    border: '1px solid #FFF',
    display: 'inline-block',
    fontSize: '8px',
    color: '#CCC'
};
const GRID_STYLE = {float: 'left', width: SQUARE_SIZE * 54};
const DAY_STYLE = {height: SQUARE_SIZE, margin: 0, padding: 0};

function normalizeNumber(n) {

    if (n < 10) {
        return String.raw`0${n}`;
    }

    return '' + n;
}

let buildDateString = (d) => {
    return normalizeNumber(d.getUTCMonth()) + '/' +
            normalizeNumber(d.getUTCDate()) + '/' +
            d.getUTCFullYear();
};

export default class CalendarChart extends Component {

    getActivityColor(key) {

        var a = this.props.activity[key];

        if (!a) {
            return '#EDEDED';
        }


        switch (a) {
            case 1:
                return '#1E6823';

            case 2:
                return '#44A340';

            case 3:
                return '#8CC665';

            case 4:
                return '#D6E685';

            default:
                return '#EDEDED';
        }

    }

    get buckets() {
        var dateIncr = 24 * 3600 * 1000,
            numSundaysInFirstMonth = 0,
            today = new Date(),
            buckets,
            colorStyle, d, dateString, c,
            firstDate, firstMonth, firstYear, actualStart;

        // Only odd days get labels
        buckets = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((v, i) => {
            if (i % 2 === 0) {
                return (<div style={SQUARE_STYLE}></div>);
            } else {
                return (<div style={SQUARE_STYLE}>{v}</div>);
            }
        });

        // Rewind one year
        firstDate = new Date(today.getUTCFullYear() - 1,
            today.getUTCMonth(), today.getUTCDate());
        // Align to sunday
        firstDate = new Date(firstDate.getTime() - Math.max(0, (today.getUTCDay() - 1)) * dateIncr);

        actualStart = new Date(today.getUTCFullYear() - 1,
            today.getUTCMonth(), today.getUTCDate());

        d = firstDate;
        firstMonth = firstDate.getUTCMonth();
        firstYear = firstDate.getUTCFullYear();


        while (d.getTime() < today.getTime()) {

            dateString = buildDateString(d);

            if (d.getTime() < actualStart.getTime()) {
                c = '#FFFF';
            } else {
                c = this.getActivityColor(dateString);
            }

            colorStyle = assign({backgroundColor: c}, SQUARE_STYLE);

            buckets[d.getUTCDay()].push(
                <div style={colorStyle} data-date={dateString}></div>
            );

            if (d.getUTCDay() && firstMonth === d.getUTCMonth()
                && firstYear === d.getUTCFullYear()) {

                numSundaysInFirstMonth++;
            }
            d = new Date(d.getTime() + dateIncr);

        }

        return buckets;
    }

    render() {

        return (
            <div className="calendar-chart clearfix">
                <div className="grid" style={GRID_STYLE}>
                    {
                        this.buckets.map(b =>
                            <div className="sunday" style={DAY_STYLE}>
                                {b}
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }

}

CalendarChart.displayName = 'CalendarChart';
CalendarChart.propTypes = {
    activity: PropTypes.object
};
