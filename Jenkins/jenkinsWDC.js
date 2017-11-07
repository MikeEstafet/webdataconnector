(function () {
    var myConnector = tableau.makeConnector();


	
	myConnector.getSchema = function (schemaCallback) {
		var cols = [{
			id: "name",
			dataType: tableau.dataTypeEnum.string
		},
		{
			id: "health_description",
			dataType: tableau.dataTypeEnum.string
		},
		{
			id: "health_score",
			dataType: tableau.dataTypeEnum.int
		}];
	
		var tableSchema = {
			id: "jenkinsFeed",
			alias: "Jenkins Pipeine Data",
			columns: cols
		};
	
		schemaCallback([tableSchema]);
	};

	myConnector.getData = function(table, doneCallback) {
		//$.getJSON("http://tableau:7d41b0f893fd40b45ae5aac36193bb10@localhost:8080/job/test-pipeline/api/json", function(resp)
		$.ajax({
		type: 'GET',
		url: 'http://localhost:8889/localhost:8080/job/test-pipeline/api/json',
		beforeSend : function(xhr) {
			var credentials = btoa('tableau' + ':' + '7d41b0f893fd40b45ae5aac36193bb10');
			xhr.setRequestHeader("Authorization", "Basic " + credentials);
		},
		dataType: 'json',
		success: function(resp) {
			var feat = resp.healthReport,
				tableData = [];
	
			
			// Iterate over the JSON object
			for (var i = 0, len = feat.length; i < len; i++) {
				tableData.push({
					"name": resp.name,
					"health_description": feat[i].description,
					"health_score": feat[i].score
				});
			}
	
			table.appendRows(tableData);
			doneCallback();
		}
	});
	};
	

    tableau.registerConnector(myConnector);
	$(document).ready(function () {
    $("#submitButton").click(function () {
        tableau.connectionName = "Jenkins Feed";
        tableau.submit();
    });
});
})();