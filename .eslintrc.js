module.exports = {
  // 停止在父级目录中寻找 .eslintrc.*
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  // 添加可能会用到的全局变量
  // 设置为 false 不允许被重写
  globals: {
    "Vue": false,
    "UE": false,
    "BMAP": false,
    "AMap": false,
    "AMapUI": false,
    "BMap": false,
    "BMapLib": false
  },
  env: {
    // 浏览器全局变量
    browser: true,
    // Node.js 全局变量和 Node.js 作用域
    node: true,
    // 启用 ES6 语法支持 及 新的 ES6 全局变量
    es6: true,
  },
  // 1. plugin:vue/recommended
  // 规则配置参考: https://eslint.vuejs.org/rules/

  // 2. eslint:recommended
  // eslint:recommended是ESLint 的推荐规则配置，包含了ESLint的规则里前面有✔︎的部分，recommended 规则只在ESLint升级大版本的才有可能改变。
  // 规则配置参考: https://eslint.org/docs/rules/
  extends: ['plugin:vue/recommended', 'eslint:recommended'],

  // 'off' 或 0 - 关闭规则
  // 'warn' 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
  // 'error' 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
  rules: {
    // v-for 指令的元素必须有 v-bind:key
    'vue/require-v-for-key': 2,
    // 组件的属性必须为一定的顺序
    'vue/order-in-components': [2, {
      'order': [
        'el',
        'name',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'data',
        'computed',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        ['template', 'render'],
        'renderError'
      ]
    }],
    // 使用组件时，命名需要以snake-case来进行
    "vue/component-name-in-template-casing": [2, "kebab-case", {
      "ignores": []
    }],
    // v-for指令与scope属性里定义的值需要被使用
    "vue/no-unused-vars": [1, {
      'vars': 'local',
      'args': 'none'
    }],
    // 强制后括弧不换行
    "vue/html-closing-bracket-newline": [2, {
      "singleline": "never",
      "multiline": "never"
    }],
    // 禁止出现重复的属性
    'vue/no-duplicate-attributes': 2,
    // v-cloak 指令的使用必须合法
    'vue/valid-v-cloak': 2,
    // 使用组件时，命名需要以snake-case来进行
    "vue/component-name-in-template-casing": [2, "kebab-case", {
      // "registeredComponentsOnly": true,
      "ignores": []
    }],
    // 强制 getter 和 setter 在对象中成对出现
    'accessor-pairs': 2,
    // 强制箭头函数的箭头前后使用一致的空格
    'arrow-spacing': [2, {
      'before': true,
      'after': true
    }],
    // 强制在代码块中开括号前和闭括号后有空格
    'block-spacing': [2, 'always'],
    // 强制在代码块中使用一致的大括号风格
    'brace-style': [2, '1tbs', {
      'allowSingleLine': true
    }],
    // 强制使用骆驼拼写法命名约定
    'camelcase': [0, {
      'properties': 'always'
    }],
    // 要求或禁止末尾逗号
    'comma-dangle': [2, 'never'],
    // 强制在逗号前后使用一致的空格
    'comma-spacing': [2, {
      'before': false,
      'after': true
    }],
    // 强制使用一致的逗号风格
    'comma-style': [2, 'last'],
    // 强制所有控制语句使用一致的括号风格, multi-line指定在单行时可以不使用大括号，多行时必须有大括号
    'curly': [2, 'multi-line'],
    // 强制在点号之前和之后一致的换行，property指定换行时的.跟随property属性 
    'dot-location': [2, 'property'],
    // 要求或禁止文件末尾存在空行
    'eol-last': 2,
    // 要求使用 === 和 !==
    'eqeqeq': [2, 'allow-null'],
    // 强制 generator 函数中 * 号周围使用一致的空格
    'generator-star-spacing': [2, {
      'before': true,
      'after': true
    }],
    // 强制使用一致的缩进
    'indent': [2, 2, {
      // 使用switch与case时需要在case前进行缩进处理
      'SwitchCase': 1
    }],
    // 强制在对象字面量的属性中键和值之间使用一致的间距, { property: 1 }
    'key-spacing': [2, {
      'beforeColon': false,
      'afterColon': true
    }],
    // 强制在关键字前后使用一致的空格， eg: else 前后空格
    'keyword-spacing': [2, {
      'before': true,
      'after': true
    }],
    // 要求构造函数首字母大写
    'new-cap': [2, {
      'newIsCap': true,
      'capIsNew': false
    }],
    // 强制或禁止调用无参构造函数时有圆括号
    'new-parens': 2,
    // 禁用 Array 构造函数
    'no-array-constructor': 2,
    // 禁用 arguments.caller 或 arguments.callee
    'no-caller': 2,
    // 禁用 console
    'no-console': 'off',
    // 禁用 eval()
    'no-eval': 2,
    // 禁止扩展原生类型
    'no-extend-native': 2,
    // 禁止不必要的 .bind() 调用
    'no-extra-bind': 2,
    // 禁止不必要的括号, functions指定仅在函数表达式附近禁止不必要的括号
    'no-extra-parens': [2, 'functions'],
    // 禁止数字字面量中使用前导和末尾小数点
    'no-floating-decimal': 2,
    // 禁止使用类似 eval() 的方法
    'no-implied-eval': 2,
    // 禁用 __iterator__ 属性
    'no-iterator': 2,
    // 禁用标签语句
    'no-labels': [2, {
      'allowLoop': false,
      'allowSwitch': false
    }],
    // 禁用不必要的嵌套块
    'no-lone-blocks': 2,
    // 禁止出现多行空行
    'no-multiple-empty-lines': [2, {
      'max': 1
    }],
    // 禁用 Object 的构造函数
    'no-new-object': 2,
    // 禁止调用 require 时使用 new 操作符
    'no-new-require': 2,
    // 禁止对 String，Number 和 Boolean 使用 new 操作符
    'no-new-wrappers': 2,
    // 禁止对 __dirname 和 __filename 进行字符串连接
    'no-path-concat': 2,
    // 禁止直接调用 __proto__ 属性
    'no-proto': 2,
    // 禁止在 return 语句中使用赋值语句
    'no-return-assign': [2, 'except-parens'],
    // 禁止自身比较
    'no-self-compare': 2,
    // 要求或禁止在函数标识符和其调用之间有空格
    'func-call-spacing': 2,
    // 禁止抛出异常字面量
    'no-throw-literal': 2,
    // 禁用行尾空格
    'no-trailing-spaces': 2,
    // 禁止可以在有更简单的可替代的表达式时使用三元操作符
    'no-unneeded-ternary': [2, {
      'defaultAssignment': false
    }],
    // 禁止出现未使用过的变量
    // 有时会出现诸如const {a, b, ...form} = res,可能会有意想不到的问题,考虑忽略单次检查
    'no-unused-vars': [2, {
      'vars': 'local',
      'args': 'none'
    }],
    // 禁止不必要的 .call() 和 .apply()
    'no-useless-call': 2,
    // 禁止在对象中使用不必要的计算属性
    'no-useless-computed-key': 2,
    // 禁用不必要的构造函数
    'no-useless-constructor': 2,
    // 禁用不必要的转义字符
    'no-useless-escape': 0,
    // 禁止属性前有空白
    'no-whitespace-before-property': 2,
    // 禁用 with 语句
    'no-with': 2,
    // 强制操作符使用一致的换行符
    'operator-linebreak': [2, 'after', {
      'overrides': {
        '?': 'before',
        ':': 'before'
      }
    }],
    // 要求或禁止块内填充
    'padded-blocks': [2, 'never'],
    // 强制使用一致的反引号、双引号或单引号
    'quotes': [2, 'single', {
      'avoidEscape': true,
      // 允许使用反引号
      'allowTemplateLiterals': true
    }],
    // 禁止使用分号
    'semi': [2, 'never'],
    // 强制在块之前使用一致的空格
    'space-before-blocks': [2, 'always'],
    // 强制在 function的左括号之前使用一致的空格
    'space-before-function-paren': [2, 'never'],
    // 强制在圆括号内使用一致的空格
    'space-in-parens': [2, 'never'],
    // 要求操作符周围有空格
    'space-infix-ops': 2,
    // 强制在一元操作符前后使用一致的空格
    'space-unary-ops': [2, {
      'words': true, // 适用于单词类一元操作符，例如：new、delete、typeof、void、yield
      'nonwords': false // 适用于这些一元操作符: -、+、--、++、!、!!
    }],
    // 强制在注释中 // 或 /* 使用一致的空格
    'spaced-comment': [2, 'always', {
      'markers': ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
    }],
    // 要求或禁止模板字符串中的嵌入表达式周围空格的使用
    'template-curly-spacing': [2, 'never'],
    // 要求 IIFE (--> 立即执行函数) 使用括号括起来
    'wrap-iife': [2, 'any'],
    // 禁用 debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 强制在对象中的大括号中使用一致的空格
    'object-curly-spacing': [2, 'always', {
      objectsInObjects: false
    }],
    // 强制数组方括号中使用一致的空格 类似于这个['foo', 'bar', 'baz']
    'array-bracket-spacing': [2, 'never']
  }
}