"use strict";

let {Services} = ChromeUtils.import("resource://gre/modules/Services.jsm");

this.perfstats = class extends ExtensionAPI {
  getAPI(context) {
    return {
      perfstats: {
        startCollection() {
          let window = Services.focus.focusedWindow;
          let mask = window.prompt("Please enter your desired collection mask (see tools/performance/PerfStats.h for a list of probes)");
          ChromeUtils.beginPerfStatsCollection(mask);
        },

        dumpStats() {
          let window = Services.focus.focusedWindow;
          ChromeUtils.collectPerfStats().then(value => {
            var perfStats = JSON.parse(value);
            var html = "<!DOCTYPE html>" +
              "<html lang='en'>" +
              "<head><title>Performance Statistics</title></head><body>";
            for (var i = 0; i < perfStats.processes.length; i++) {
              var process = perfStats.processes[i];
              var c = 0;

              if (process.type === "parent") {
                html +="<b>Parent process</b><br>";
              } else if (process.type === "gpu") {
                html += "<b>GPU process</b><br>";
              } else {
                html += "<b>Process " + process.id + " (" + process.type + ")</b><br>";
                for (c = 0; c < process.urls.length; c++) {
                  html += process.urls[c] + "<br>";
                }
              }
              html += "<br><table><tr><th>Probe</th><th>Time spent</th></tr>";
              for (c = 0; c < process.perfstats.metrics.length; c++) {
                var metric = process.perfstats.metrics[c];
                html += "<tr><td>" + metric.metric + "</td><td>" + Math.round(metric.time * 1000) / 1000 + " ms</td></tr>";
              }
              html += "</table><br><br>";
            }
            html += "</body></html>";
            window.open("data:text/html;charset=utf-8," +
              encodeURIComponent(html), "PerfStats", "toolbar=0,menubar=0,location=0,width=600"
            );
          });
        },
      }
    };
  }
}

