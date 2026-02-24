export class HUD {
  public readonly element: HTMLDivElement;
  private readonly scoreValue: HTMLSpanElement;
  private readonly pelletsValue: HTMLSpanElement;
  private readonly statusValue: HTMLDivElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'hud';

    const scoreLabel = this.buildMetric('Score');
    this.scoreValue = scoreLabel.value;

    const pelletsLabel = this.buildMetric('Pellets');
    this.pelletsValue = pelletsLabel.value;

    this.element.append(scoreLabel.container, pelletsLabel.container);

    this.statusValue = document.createElement('div');
    this.statusValue.className = 'hud__status';
    this.statusValue.textContent = 'Collect all pellets!';
    this.element.appendChild(this.statusValue);
  }

  public updateScore(points: number): void {
    this.scoreValue.textContent = points.toString();
  }

  public updatePellets(collected: number, total: number): void {
    this.pelletsValue.textContent = `${collected}/${total}`;
  }

  public setStatus(message: string): void {
    this.statusValue.textContent = message;
  }

  private buildMetric(label: string): { container: HTMLDivElement; value: HTMLSpanElement } {
    const container = document.createElement('div');
    container.className = 'hud__metric';

    const metricLabel = document.createElement('span');
    metricLabel.className = 'hud__label';
    metricLabel.textContent = label;

    const value = document.createElement('span');
    value.className = 'hud__value';
    value.textContent = '0';

    container.append(metricLabel, value);

    return { container, value };
  }
}
