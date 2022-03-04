# @push-based/user-flow

This is a small library to organize and run Lighthouse UserFlow scripts in an organized and scalable way with CI automation in place 🛸.

**Benefits**
- No boiler plate
- Write tests directly in TypeScript (no compilation with `tsc` needed)
- Use best practices out of the box
- Scale with UFO's 🛸
- Run it in your CI automations  

## Install

Run 
`npm i @push-based/user-flow --save`  or `yarn i @push-based/user-flow` 
to install the library.

## Usage

1. Setup `.user-flowrc.json`;

```json
{
  // Path to user flows from root directory
  "ufPath": "./",
  // Output path for the reports from root directory
  "outPath": "./",
  // URL to analyze
  "targetUrl": "https://localhost"
}
```

2. Create a `my-user-flow.uf.ts` file.

**./my-user-flow.uf.ts**
```typescript
import {
  LauncheOptions,
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
  UserFlowProvider
} from '@push-based/user-flow';

// Optional overright lounchsettings of puppeteer
const launcheOptions: LauncheOptions = {
  headless: true
};

// Setup UserFlow options
const flowOptions: UserFlowOptions = {
  name: 'Category to Detail Navigation - Cold',
};

// Your custom interactions with the page 
const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, baseUrl } = ctx;
  const url = `${baseUrl}/list`;

  const sideMenuBtnSelector = '#main-side-bar div.header-wrapper .hamburger-btn';
  const firstMovieListImg = '.ui-movie-list img.movie-img-1';
  
  await flow.startTimespan({
    stepName: 'Navigate to list page',
  });

  await page.waitForSelector(sideMenuBtnSelector);
  await page.click(sideMenuBtnSelector);
  await page.waitForSelector(firstMovieListImg);

  await flow.endTimespan();

  return Promise.resolve();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions,
  launcheOptions
};

module.exports = userFlowProvider;
```

3. Run cli
You can directly run the cli command. The typescript files will get resolved and compiled live. 

`npx @push-based/user-flow --targetUrl=https://localhost:4200`

Optionally you can pass params to overwrite the values form `.user-flowrc.ts`

`npx @push-based/user-flow --ufPath=./user-flows --outPath=./user-flows-reports --targetUrl=https://localhost:4200` to build the library.

## CLI options

|  Option                     |  Type     | Default     |  Description                                                                                               |  
| --------------------------- | --------- | ----------- |----------------------------------------------------------------------------------------------------------- |  
| **`--help`**                | `boolean` | `undefined` | Show help                                                                                                  |  
| **`--version`**             | `boolean` | `undefined` | Show version number                                                                                        |   
| **`--cfgPath`**, **`-p`**   | `boolean` | `undefined` | Path to user-flow.config.json. e.g. `./user-flowrc.json`                                                   |  
| **`--targetUrl`**, **`-t`** | `boolean` | `undefined` | URL to analyze                                                                                             |  
| **`--ufPath`**, **`-f`**    | `boolean` | `undefined` | folder containing user-flow files to run. (`*.uf.ts` or`*.uf.js`)                                          |  
| **`--outPath`**, **`-o`**   | `boolean` | `undefined` | output folder for the user-flow reports                                                                    |  
| **`--open`**, **`-e`**      | `boolean` | `undefined` | Opens browser automatically after the user-flow is captured                                                |  
| **`--verbose`**, **`-v`**   | `boolean` | `undefined` | Run with verbose logging                                                                                   |  
| **`--interactive`**         | `boolean` | `undefined` | When false questions are skipped with the values from the suggestions. This is useful for CI integrations. | 

## Write user-flows with UFO's 🛸

When writing tests for multiple interactions or pages, or even for different platforms you are forced to organize your code propperly.
Otherwise, the amount of low-level code get's a night mare to maintain...


**This is the reason we introduced UFO's!**  
**Organize cluttery code 👽 in developer friendly shells 🛸**  

It pays off to organize your code in a reusable way and abstract certain different layers of logic:
- UI selectors (the actual DOM selectors which may change often even if the UI stays visually the same)
- Atomic UI interactions and performance relevant logic
- User interaction flow including all steps and measures


UFO's (user-flow objects) are a very similar to the concept of [PageObjects](https://martinfowler.com/bliki/PageObject.html) where you separate the API's for accessing the actual UI form the application related code.
The difference however is that the higher layer focuses on performance related interactions.

Here we can introcude terms related to lighthouse user-flow. 
For example every object could have a CLP element, or we detect when a UI-Facade got interactive. 

Let's first think about the folder structure and how we organize the different pieces:

**Folder Structure**
```bash
📦my-app
 ┣ 📂src
 ┣ 📂dist
   ┗ 📂my-app-user-flows
 ┣ ...
 ┗ 📂my-app-user-flows
   ┣ 📜.user-flowrc.json
   ┣ 📂fixtures
   ┣ ┗ 📜list-page.ufo.ts
   ┣ 📂ufo
   ┣ ┣ 📜sidebar.ufo.ts
   ┣ ┣ 📜list.ufo.ts
   ┣ ┗ 📜list-page.ufo.ts
   ┗ 📂user-flow
     ┗ 📜my-user-flow.uf.ts
```

### Setup 
Move `.user-flowrc.json` into `my-app-user-flows` and change the configuration to:

**./my-app-user-flows/.user-flowrc.json**
```json
{
  "ufPath": "./my-app-user-flows/user-flow",
  "outPath": "./dist/my-app-user-flows",
  "targetUrl": "https://localhost"
}
```

### Fixtures
Fixtures maintain all your UI related selector login. Mostly this are strings but also getter functions are possible to be organized here.

> **ℹ Tip:**
> Avoid selectors that are connected to layout and styles e.g. `#main-side-bar div.header-wrapper .hamburger-btn`.
> Instead introduce a data attribute only related to user flow tests e.g. `*[data-uf="sidebar--main-btn"]`
> Usage: `<button data-uf="sidebar--main-bt">...</button>`

```typescript
  const sidebarBtnSelector = '*[data-uf="sidebar--main-btn"]';
  const SidebarListLinkSelector = '*[data-uf="sidebar--list-link"]';
  const movieListImgSelector = (idx: number): string => `*[data-uf="movie-list--img-${idx}"]`;
```

### UFO's 🛸

User flow objects maintain UI elements relevant for the interactions and to determine when certain interactions like navigation or rendering are done. 
This objects are composeable, meaning they maintain units that can be reused within each other or grouped to bigger units.

In our case we have the sidebar, and the target page displaying the list.
We extend from the Ufo class to get the page object set up for us and ensure the sidebar creation got passed the page object in the actual user-flow.

> **ℹ Tip:**
> To ensure the page object is available in an UFO you can extend from `Ufo` provided in `@push-based/user-flow`.

**./ufo/sidebar.ufo.ts**
```typescript
export class Sidebar extends Ufo {
  btnSelector = fixtures.sidebarBtnSelector;
  listLinkSelector = fixtures.sidebarListLink;

  async clickSidebarBtn() {
    await this.page.waitForSelector(this.btnSelector);
    await this.page.click(this.btnSelector);
  }

  async navigateToList() {
    await this.page.waitForSelector(this.listLinkSelector);
    await this.page.click(this.listLinkSelector);
  }
}
```

**./ufo/list.ufo.ts**
```typescript
export class List extends Ufo {
  itemSelector = fixtures.movieListImgSelector;

  async clickItem(idx: number = 0) {
    const item = this.itemSelector(idx);
    await this.page.waitForSelector(item);
    await this.page.click(item);
  }

  async awaitLCP() {
    await this.page.waitForSelector(this.itemSelector(0));
  }
}
```

**./ufo/list-page.ufo.ts**
```typescript
//      ensure page is present 👇
export class ListPage extends Ufo {
  list = new List(this.page);
  
  async awaitLCP() {
    await this.list.awaitLCP();
  }
 
}
```

### User Flows

**./user-flow/my-user-flow.uf.ts**
```typescript
import {
  UserFlowOptions,
  UserFlowInteractionsFn,
  UserFlowContext,
  UserFlowProvider
} from '@push-based/user-flow';

const flowOptions: UserFlowOptions = {
  name: 'Category to Detail Navigation - Cold',
};

const interactions: UserFlowInteractionsFn = async (ctx: UserFlowContext): Promise<any> => {
  const { page, flow, baseUrl } = ctx;
  const url = `${baseUrl}/list`;
  
  // 👇 Setup UFO's
  const sidebar = new SideBar({page});
  const listPage = new ListPage({page});
  
  await flow.startTimespan({
    stepName: 'Navigate to list page',
  });
  
  // 👇 Interaction logic
  await sidebar.awaitLCP();
  await listPage.awaitLCP();

  await flow.endTimespan();
};

const userFlowProvider: UserFlowProvider = {
  flowOptions,
  interactions
};

module.exports = userFlowProvider;
```

### Usage

To run the user flows use the `-p` option to point to the new config file

`npx @push-based/user-flow -p=./my-app-user-flows/.user-flowrc.json`
