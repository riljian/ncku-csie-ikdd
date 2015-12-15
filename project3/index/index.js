/*global d3: false, Firebase: false, $:false */

var DESC = {
    'type': [
        '休閒益智類',
        '體育類',
        '其他類',
        '冒險類',
        '動作類',
        '卡片類',
        '即時戰略類',
        '射擊類',
        '文字類',
        '格鬥類',
        '模擬類',
        '競速類',
        '策略類',
        '角色扮演類',
        '音樂類'
    ],
    'version': [
        '未知',
        '中文',
        '英文',
        '中+英文',
        '日文',
        '中+日文',
        '英+日文',
        '中+英+日文',
        '歐洲語言',
        '中文+歐洲語言',
        '英文+歐洲語言',
        '中+英文+歐洲語言',
        '日文+歐洲語言',
        '中+日文+歐洲語言',
        '英+日文+歐洲語言',
        '中+英+日文+歐洲語言'
    ],
    'platform': [
        '3DS',
        'GBA',
        'PC',
        'PS',
        'PS3',
        'PS4',
        'PSP',
        'PSV',
        'WII',
        'WII U',
        'XBOX 360',
        'XBOX ONE'
    ]
};
var X_DOMAIN = [new Date(343260800 * 1000), new Date(1481881600 * 1000)],
    Y_DOMAIN = [Math.log10(100), Math.log10(2600000)];
var POINT_COLOR,
    cata = 'type',
    xScale,
    yScale;

function updateScales(xDomain, yDomain) {
    'use strict';
    xScale = d3.time.scale().domain(xDomain).range([20, 880]);
    yScale = d3.scale.linear().domain(yDomain).range([600, 100]);
    
    d3.select('svg g.chart g#xAxis')
        .transition()
        .call(d3.svg.axis()
             .scale(xScale)
             .orient('bottom'));
    
    d3.select('svg g.chart g#yAxis')
        .transition()
        .call(d3.svg.axis()
             .scale(yScale)
             .orient('left'));
}

function updateFlot() {
    'use strict';
    d3.select('svg g.chart')
        .selectAll('circle')
        .attr('fill', function (d) {
            return POINT_COLOR(d[cata]);
        })
        .attr('visibility', function (d) {
            return $('input#checkbox-' + d[cata]).prop('checked') ? 'visible' : 'hidden';
        });
}

function toggleAll() {
    'use strict';
    $('input[id^="checkbox"]').click();
}

function updateMenu() {
    'use strict';
    var label;
    $('div#option').html('');
    label = d3.select('div#option')
        .selectAll('label')
        .data(DESC[cata])
        .enter()
        .append('label')
        .classed({
            'mdl-checkbox': true,
            'mdl-js-checkbox': true,
            'mdl-js-ripple-effect': true
        })
        .attr('for', function (d, i) {
            return 'checkbox-' + i;
        });
    label.append('input')
        .classed('mdl-checkbox__input', true)
        .property('checked', true)
        .attr('type', 'checkbox')
        .attr('id', function (d, i) {
            return 'checkbox-' + i;
        });
    label.append('span')
        .classed('mdl-checkbox__label', true)
        .style('color', function (d, i) {
            return POINT_COLOR(i);
        })
        .text(function (d) {
            return d;
        });
}

function changeCata(a, ct) {
    'use strict';
    cata = ct;
    $('span#cata').html($(a).text());
    updateMenu();
    updateFlot();
}

(function () {
    'use strict';
    var svg,
        data = [],
        ref;
    POINT_COLOR = d3.scale.category20();
    ref = new Firebase("https://burning-fire-3884.firebaseio.com/game");
    ref.once('value', function (snapshot) {
        data = snapshot.val();
    
        // Points
        d3.select('svg g.chart')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function (d) {
                return xScale(new Date(d.time * 1000));
            })
            .attr('cy', function (d) {
                return yScale(Math.log10(d.view));
            })
            .attr('r', 2)
            .on('mouseover', function (d) {
                window.console.log(d);
            });
        updateFlot();
    });
    
    svg = d3.select('#plot')
            .append('svg')
            .attr('width', '1000px')
            .attr('height', '640px');
    svg.append('g').classed('chart', true).attr('transform', 'translate(90, -40)');
    
    // Axis labels
    d3.select('svg g.chart')
        .append('text')
        .attr({'id': 'xLabel', 'x': 450, 'y': 670})
        .text('時間');
    d3.select('svg g.chart')
        .append('text')
        .attr('id', 'yLabel')
        .attr('transform', 'translate(-75, 330) rotate(-90)')
        .text('瀏覽');
    
    // Axis scales
    d3.select('svg g.chart')
        .append('g')
        .attr('transform', 'translate(0, 630)')
        .attr('id', 'xAxis');
    d3.select('svg g.chart')
        .append('g')
        .attr('transform', 'translate(5, 0)')
        .attr('id', 'yAxis');
    updateScales(X_DOMAIN, Y_DOMAIN);
    
    // Menu
    updateMenu();
}());