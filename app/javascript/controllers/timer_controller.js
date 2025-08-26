import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="timer"
export default class extends Controller {
  static targets = [ "output" ]

  connect() {
    this.seconds = 0;
    this.timer = null;
    console.log("timer controller connected");
  }
  
  start() {
    if (this.timer) {
      return; // Timer is already running
    }

    this.timer = setInterval(() => {
      this.seconds++;
      this.outputTarget.textContent = this.formatTime(this.seconds);
      //this.sendTimeToServer();
    }, 1000);

  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  reset() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.seconds = 0;
    this.outputTarget.textContent = this.formatTime(this.seconds);
  }

  formatTime(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .join(":");
  }

  disconnect() {
    // Ensure the timer is cleared if the element is removed from the DOM
    this.stop();
  }
}
