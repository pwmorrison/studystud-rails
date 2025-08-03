import { Controller } from "@hotwired/stimulus";
import initGame from "../game/main";

// Connects to data-controller="game"
export default class extends Controller {
  connect() {
    this.game = initGame(this.element);
  }

  disconnect() {
    if (this.game) {
      this.game.destroy(true);
    }
  }
}
