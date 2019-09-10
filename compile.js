class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el);
    this.vm = vm;
    // 能获取到元素才开始编译
    if (this.el) {
      // 1.把真实的 dom 移入到内存中 fragment 文档碎片
      let fragment = this.nodeToFragment(this.el);
      // 2.编译 提取元素和文本节点 
      // 3.把编译好的 fragment 塞回到真实的 dom 中
    }
  }
  // 辅助方法
  isElementNode (node) {
    return node.nodeType === 1;
  }
  // 核心方法
  nodeToFragment (el) {
    // 内存中的 dom节点
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = el.firstChild) {
      fragment.appendChild(firstChild);
    };
    console.log(fragment);
    return fragment;
  }
}