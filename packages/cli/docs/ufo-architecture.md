

## Write lighthouse user flows with UFO's 🛸

When writing tests for multiple interactions or pages, or even for different platforms you are forced to organize your code propperly.
Otherwise, the amount of low-level code becomes a night mare to maintain...


**This is the reason we introduced UFO's!**  
**Organize cluttery lighthouse user flows code 👽 in developer friendly shells 🛸**  

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
 ┣ ┗ 📂my-app-user-flows
 ┣ ...
 ┗ 📂my-app-user-flows
   ┣ 📜.user-flowrc.json
   ┣ 📂fixtures
   ┣ ┗ 📜list-page.ufo.ts
   ┣ 📂ufo
   ┣ ┣ 📜sidebar.ufo.ts
   ┣ ┣ 📜list.ufo.ts
   ┣ ┗ 📜list-page.ufo.ts
   ┗ 📂user-flows
     ┗ 📜my-user-flow.uf.ts
```

### Setup 
Move `.user-flowrc.json` into `my-app-user-flows` and change the configuration to:

**./my-app-user-flows/.user-flowrc.json**
```json
{
  "collect": { 
    "url": "http:localhost:4200/", 
    "ufPath": "./my-app-user-flows/user-flows" 
  },
  "persist": { 
    "outPath": "./dist/my-app-user-flows", 
    "format": ["html"] 
  }
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

### UFO's 🛸 - user flow objects

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

**./user-flows/my-user-flow.uf.ts**
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

made with ❤ by [push-based.io](https://www.push-based.io)
