// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier/flat');

module.exports = tseslint.config(
  {
    ignores: [
      'dist/**',
      '.angular/**',
      // --- Legacy V1/V2 presentation layer -------------------------------
      // This list is the deletion checklist. Remove each entry in the phase
      // noted and run the linter again; when the list is empty, the legacy
      // layer is gone. Never add new code here.
      'src/app/components/**', // phase 4: hero, about, skills, projects, contact, socials
      // -------------------------------------------------------------------
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    // Type-aware linting. Required by no-uncalled-signals; costs some speed.
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: __dirname },
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],

      // --- Conventions from references/architecture.md --------------------
      // OnPush on every component.
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      // input() over @Input(), viewChild() over @ViewChild, readonly signals.
      '@angular-eslint/prefer-signals': 'error',
      // output() over @Output(), and keep it immutable.
      '@angular-eslint/prefer-output-emitter-ref': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      // Reading a signal without calling it is always a bug.
      '@angular-eslint/no-uncalled-signals': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      // @if / @for / @switch instead of *ngIf / *ngFor / ngSwitch.
      '@angular-eslint/template/prefer-control-flow': 'error',
    },
  },
  // Must stay last: turns off stylistic rules that would fight Prettier.
  prettier,
);
