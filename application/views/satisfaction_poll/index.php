<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Codeigniter dev env</title>
    <link rel="stylesheet" href="<?php echo base_url('assets/css/bootstrap.css')?>">
    <link rel="stylesheet" href="<?php echo base_url('assets/css/main.css')?>">
</head>
<body ng-app="rootModule">

<div class="container">
    <div class="col-md-6 col-md-offset-3">
        <div class="page-header">
            <h1 class="text-center">Cargar evaluación</h1>
        </div>
        <form novalidate name="loadForm">
            <div class="form-group">
                <label class="control-label">Cliente</label>
                <select class="form-control">
                    <option value="all">Todos</option>
                    <option value="1">Cliente 1</option>
                    <option value="2">Cliente 2</option>
                    <option value="3">Cliente 3</option>
                    <option value="4">Cliente 4</option>
                </select>
            </div>
            <div class="form-group">
                <label class="control-label">Periodo</label>
                <select class="form-control">
                    <option value="">Todo</option>
                    <option value="1">Q1</option>
                    <option value="2">Q2</option>
                    <option value="3">Q3</option>
                    <option value="4">Q4</option>
                </select>
            </div>
            <div class="form-group">
                <label class="control-label">Calificación</label>
                <input type="number"
                       class="form-control"
                       step=".05"
                       min="1" max="5">
            </div>
            <div class="form-group">
                <div class="input-group">
                    <span class="input-group-btn">
                        <span class="btn btn-info btn-file">
                            <span class="glyphicon glyphicon-folder-open"></span>
                            Cargar <input type="file" file-bootstrap>
                        </span>
                    </span>
                    <input class="form-control" id="btn-file-text">
<!--                    <input type="file" class="form-control">-->
                </div>
            </div>
            <button type="submit"
                    class="btn btn-primary btn-block">
                <span class="glyphicon glyphicon-ok-sign"></span>
                Aceptar
            </button>
        </form>
    </div>
    <div class="col-md-12" ng-controller="D3ChartsCtrl">
        <div ac-chart="pie"
             class="chart"
             data-ac-config="d3Config"
             data-ac-data="d3Data"></div>
    </div>
</div>

<script src="<?php echo base_url('assets/js/angular.js')?>"></script>
<script src="<?php echo base_url('bower_components/d3/d3.js')?>"></script>
<script src="<?php echo base_url('bower_components/angular-charts/dist/angular-charts.js')?>"></script>
<script src="<?php echo base_url('assets/js/app/app.js')?>"></script>
<script src="<?php echo base_url('assets/js/app/d3Charts.js')?>"></script>
<script src="<?php echo base_url('assets/js/directives/inputFile.js')?>"></script>
</body>