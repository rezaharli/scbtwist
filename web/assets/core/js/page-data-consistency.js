'use strict';

viewModel.AvailabilityAnalysis = new Object();
var pg = viewModel.AvailabilityAnalysis;
var maxdate = new Date(Date.UTC(2016, 5, 30, 23, 59, 59, 0));

pg.type = ko.observable();
pg.detailDTTopTxt = ko.observable();
pg.isDetailDTTop = ko.observable(false);
pg.periodDesc = ko.observable();

pg.breakDownList = ko.observableArray([
    { "value": "dateinfo.dateid", "text": "Date" },
    { "value": "dateinfo.monthdesc", "text": "Month" },
    { "value": "dateinfo.year", "text": "Year" },
    { "value": "projectname", "text": "Project" },
    { "value": "turbine", "text": "Turbine" },
]);

pg.getPeriodDesc = function () {
    var duration = ((fa.dateEnd - fa.dateStart) / 86400000) + 1;
    var breakDownVal = $("#breakdownlist").data("kendoDropDownList").value();
    if (breakDownVal == "dateinfo.dateid") {
        pg.periodDesc = fa.dateStart + " to " + fa.dateEnd;
    } else {
        pg.periodDesc = "";
    }
}

pg.dgrScada = function () {
    setTimeout(function () {
        fa.LoadData();
        pg.initSummaryGrid();
        // fa.getProjectInfo();
    }, 1000);
}

pg.initSummaryGrid = function () {
    var param = {
        period: fa.period,
        Turbine: fa.turbine,
        DateStart: fa.dateStart,
        DateEnd: fa.dateEnd,
        Project: fa.project
    };

    $("#gridSummaryDgrScada").kendoGrid({
        theme: "flat",
        columns: [
            { title: " ", field: "desc", headerAttributes: { style: "text-align: center" }, attributes: { class: "align-left" }, width: 150 },
            { title: "DGR", width: 120, field: "dgr", headerAttributes: { style: "text-align: center" }, attributes: { class: "align-center" }, template: "#if(desc== 'PLF'){# #: kendo.toString(dgr, 'N2') # #if(dgr!= 'N/A'){# % #}}else if(desc== 'Grid Availability'){# #: kendo.toString(dgr, 'N2') # #if(dgr!= 'N/A'){# % #}}else if(desc== 'Machine Availability'){# #: kendo.toString(dgr, 'N2') # #if(dgr!= 'N/A'){# % #}}else if(desc=='True Availability'){# #: kendo.toString(dgr, 'N2') # #if(dgr!= 'N/A'){# % #}}else {# #: kendo.toString(dgr, 'N2') # #}#" },
            { title: "Scada", width: 120,field: "scada", headerAttributes: { style: "text-align: center" }, attributes: { class: "align-center" }, template: "#if(desc== 'PLF'){# #: kendo.toString(scada, 'N2') # #if(scada!= 'N/A'){# % #}}else if(desc== 'Grid Availability'){# #: kendo.toString(scada, 'N2') # #if(scada!= 'N/A'){# % #}}else if(desc== 'Machine Availability'){# #: kendo.toString(scada, 'N2') # #if(scada!= 'N/A'){# % #}}else if(desc=='True Availability'){# #: kendo.toString(scada, 'N2') # #if(scada!= 'N/A'){# % #}}else {# #: kendo.toString(scada, 'N2') # #}#" },
            { title: "Scada HFD", width: 120,field: "ScadaHFD", headerAttributes: { style: "text-align: center" }, attributes: { class: "align-center" }, template: "#if(desc== 'PLF'){# #: kendo.toString(ScadaHFD, 'N2') # #if(ScadaHFD!= 'N/A'){# % #}}else if(desc== 'Grid Availability'){# #: kendo.toString(ScadaHFD, 'N2') # #if(ScadaHFD!= 'N/A'){# % #}}else if(desc== 'Machine Availability'){# #: kendo.toString(ScadaHFD, 'N2') # #if(ScadaHFD!= 'N/A'){# % #}}else if(desc=='True Availability'){# #: kendo.toString(ScadaHFD, 'N2') # #if(ScadaHFD!= 'N/A'){# % #}}else {# #: kendo.toString(ScadaHFD, 'N2') # #}#" },
            {
                title: "Difference",
                headerAttributes: { style: 'font-weight: bold; text-align: center;' },
                columns: [
                    { title: "DGR vs Scada", width: 120,field: "difference", headerAttributes: { style: "text-align: center" }, attributes: { class: "align-center" }, template: "#if(desc== 'PLF'){# #: kendo.toString(difference, 'N2') # % #}else if(desc== 'Grid Availability'){# #: kendo.toString(difference, 'N2') # % #}else if(desc== 'Machine Availability'){# #: kendo.toString(difference, 'N2') # % #}else if(desc=='True Availability'){# #: kendo.toString(difference, 'N2') # % #}else {# #: kendo.toString(difference, 'N2') # #}#" },
                    { title: "DGR vs Scada HFD", width: 120,field: "diffdgrhfd", headerAttributes: { style: "text-align: center" }, attributes: { class: "align-center" }, template: "#if(desc== 'PLF'){# #: kendo.toString(diffdgrhfd, 'N2') # % #}else if(desc== 'Grid Availability'){# #: kendo.toString(diffdgrhfd, 'N2') # % #}else if(desc== 'Machine Availability'){# #: kendo.toString(diffdgrhfd, 'N2') # % #}else if(desc=='True Availability'){# #: kendo.toString(diffdgrhfd, 'N2') # % #}else {# #: kendo.toString(diffdgrhfd, 'N2') # #}#" },
                 ]
            },

        ],
        /*dataSource: {
            data : dataSource,
        }*/
        dataSource: {
            serverPaging: false,
            serverSorting: false,
            serverFiltering: false,
            transport: {
                read: {
                    url: viewModel.appName + "analyticdgrscada/getdata",
                    type: "POST",
                    data: param,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8"
                },
                parameterMap: function (options) {
                    return JSON.stringify(options);
                }
            },
            schema: {
                model: {
                    fields: {
                        AlarmOkTime: { type: "number" },
                        OkTime: { type: "number" },
                        Power: { type: "number" },
                        PowerLost: { type: "number" },
                    }
                },
                data: function (res) {
                    app.loading(false);
                    if (!app.isFine(res)) {
                        return;
                    }
                    return res.data
                }
            },
        }
    });
}

pg.loadData = function () {
    app.loading(true);

    var request = toolkit.ajaxPost(viewModel.appName + "analyticlossanalysis/getavaildate", {}, function (res) {
        if (!app.isFine(res)) {
            return;
        }
        var minDatetemp = new Date(res.data.ScadaData[0]);
        var maxDatetemp = new Date(res.data.ScadaData[1]);

        var minDatetempHfd = new Date(res.data.ScadaDataHFD[0]);
        var maxDatetempHfd = new Date(res.data.ScadaDataHFD[1]);

        var dgrMinDatetemp = new Date(res.data.DGRData[0]);
        var dgrMaxDatetemp = new Date(res.data.DGRData[1]);

        $('#availabledatestartscadahfd').html(kendo.toString(moment.utc(minDatetempHfd).format('DD-MMMM-YYYY')));
        $('#availabledateendscadahfd').html(kendo.toString(moment.utc(maxDatetempHfd).format('DD-MMMM-YYYY')));

        $('#availabledatestartscada').html(kendo.toString(moment.utc(minDatetemp).format('DD-MMMM-YYYY')));
        $('#availabledateendscada').html(kendo.toString(moment.utc(maxDatetemp).format('DD-MMMM-YYYY')));

        $('#availabledatestartdgr').html(kendo.toString(moment.utc(dgrMinDatetemp).format('DD-MMMM-YYYY')));
        $('#availabledateendsdgr').html(kendo.toString(moment.utc(dgrMaxDatetemp).format('DD-MMMM-YYYY')));
    });

    var dgrScada = setTimeout(function () {
        // pg.SetBreakDown();

        if (fa.project == "") {
            pg.type = "Project Name";
        } else {
            pg.type = "Turbine";
        }
        pg.dgrScada();
    }, 100);
}

pg.refreshGrid = function () {
    setTimeout(function () {
        $("#gridSummaryDgrScada").data("kendoGrid").refresh();
    }, 50);
}

pg.SetBreakDown = function () {
    pg.breakDown = [];

    setTimeout(function () {
        $.each(pg.breakDownList(), function (i, valx) {
            $.each(fa.GetBreakDown(), function (i, valy) {
                if (valx.text == valy.text) {
                    pg.breakDown.push(valx);
                }
            });
        });

        $("#breakdownlist").data("kendoDropDownList").dataSource.data(pg.breakDown);
        $("#breakdownlist").data("kendoDropDownList").dataSource.query();
        if ($("#breakdownlist").data("kendoDropDownList").value() == "") {
            $("#breakdownlist").data("kendoDropDownList").select(0);
        }
    }, 1000);
}

vm.currentMenu('Data Consistency');
vm.currentTitle('Data Consistency');
vm.breadcrumb([{ title: "KPI's", href: '#' }, { title: 'Data Consistency', href: viewModel.appName + 'page/analyticwindavailability' }]);


$(document).ready(function () {
    
    fa.LoadData();
    $('#btnRefresh').on('click', function () {
        fa.LoadData();
        pg.loadData();
    });

    setTimeout(function () {
        fa.LoadData();
        pg.loadData();
    }, 1000);

    // smart filter :)

    /*$('#periodList').kendoDropDownList({
        data: fa.periodList,
        dataValueField: 'value',
        dataTextField: 'text',
        suggest: true,
        change: function () { fa.showHidePeriod(pg.SetBreakDown()) }
    });

    setTimeout(function () {
        $('#projectList').kendoDropDownList({
            data: fa.projectList,
            dataValueField: 'value',
            dataTextField: 'text',
            suggest: true,
            change: function () { pg.SetBreakDown() }
        });

        $("#dateStart").change(function () { fa.DateChange(pg.SetBreakDown()) });
        $("#dateEnd").change(function () { fa.DateChange(pg.SetBreakDown()) });

    }, 1500);*/

});