# generative.js

## 0.0.7

### Patch Changes

- 4a7deeb: Use spans to mark generative context instead of nested div.
  Use hierarchical ids to evaluate previous ancestor.
- 806f71b: Remove className props, no longer relevant since using span markers
- 2a46637: Pass afterChildren handler to useGenerative, remove separate useAfterChildren hook

## 0.0.6

### Patch Changes

- a7d8321: Support for multiple and nested generatives per render
- 85ee63e: Add AnthropicAssistant, make Assistant generic

## 0.0.5

### Patch Changes

- a08a0f2: Rename onBeforeResolved to onMessage. Remove onBeforeFinalized.
- 0ca21ff: Add MessageContext and useMessage hook for message handling UI components

## 0.0.4

### Patch Changes

- b07fa19: Add WorkerPool

## 0.0.3

### Patch Changes

- 0287890: Port of Performer to React

## 0.0.2

### Patch Changes

- 894cfcf: Add publishing
