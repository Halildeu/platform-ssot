import meta from "../../../pages/_meta.ts";
import blocks_meta from "../../../pages/blocks/_meta.ts";
import migration_meta from "../../../pages/migration/_meta.ts";
import x_suite_meta from "../../../pages/x-suite/_meta.ts";
export const pageMap = [{
  data: meta
}, {
  name: "blocks",
  route: "/blocks",
  children: [{
    data: blocks_meta
  }, {
    name: "index",
    route: "/blocks",
    frontMatter: {
      "sidebarTitle": "Index"
    }
  }]
}, {
  name: "getting-started",
  route: "/getting-started",
  frontMatter: {
    "sidebarTitle": "Getting Started"
  }
}, {
  name: "index",
  route: "/",
  frontMatter: {
    "sidebarTitle": "Index"
  }
}, {
  name: "migration",
  route: "/migration",
  children: [{
    data: migration_meta
  }, {
    name: "index",
    route: "/migration",
    frontMatter: {
      "sidebarTitle": "Index"
    }
  }]
}, {
  name: "x-suite",
  route: "/x-suite",
  children: [{
    data: x_suite_meta
  }, {
    name: "charts",
    route: "/x-suite/charts",
    frontMatter: {
      "sidebarTitle": "Charts"
    }
  }, {
    name: "data-grid",
    route: "/x-suite/data-grid",
    frontMatter: {
      "sidebarTitle": "Data Grid"
    }
  }, {
    name: "editor",
    route: "/x-suite/editor",
    frontMatter: {
      "sidebarTitle": "Editor"
    }
  }, {
    name: "form-builder",
    route: "/x-suite/form-builder",
    frontMatter: {
      "sidebarTitle": "Form Builder"
    }
  }, {
    name: "index",
    route: "/x-suite",
    frontMatter: {
      "sidebarTitle": "Index"
    }
  }, {
    name: "kanban",
    route: "/x-suite/kanban",
    frontMatter: {
      "sidebarTitle": "Kanban"
    }
  }, {
    name: "scheduler",
    route: "/x-suite/scheduler",
    frontMatter: {
      "sidebarTitle": "Scheduler"
    }
  }]
}];