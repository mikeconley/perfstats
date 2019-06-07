const PerfStats = {
  _isCollecting: false,

  init() {
    browser.commands.onCommand.addListener(this.commandListener.bind(this));
  },

  commandListener(command) {
    switch (command) {
      case "DumpReport": {
        this.startCollectingOrDumpStats();
        break;
      }
    }
  },

  startCollectingOrDumpStats() {
    if (!this._isCollecting) {
      browser.perfstats.startCollection();
      this._isCollecting = true;
    } else {
      browser.perfstats.dumpStats();
      this._isCollecting = false;
    }
  },
}

PerfStats.init();
