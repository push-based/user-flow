import './app.element.css';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    const title = 'nx-plugin-integration';

    this.innerHTML = `
    <div class="wrapper">
      <div class="container">
        <!--  WELCOME  -->
        <div id="welcome">
          <h1>
            <span> Hello there, </span>
            Welcome ${title} 👋
          </h1>
        </div>

        <!--  HERO  -->
        <div id="hero" class="rounded">
          <div class="text-container">
            <h2>You&apos;re up and running</h2>
          </div>
        </div>

      </div>
    </div>
      `;
  }
}

customElements.define('user-flow-root', AppElement);
