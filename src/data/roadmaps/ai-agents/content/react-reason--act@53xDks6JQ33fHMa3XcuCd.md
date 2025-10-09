# ReAct (Reason + Act)

ReAct is an agent pattern that makes a model alternate between two simple steps: Reason and Act. First, the agent writes a short thought that sums up what it knows and what it should try next. Then it performs an action such as calling an API, running code, or searching a document. The result of that action is fed back, giving the agent fresh facts to think about. This loop repeats until the task is done. By showing its thoughts in plain text, the agent can be inspected, debugged, and even corrected on the fly. The clear split between thinking and doing also cuts wasted moves and guides the model toward steady progress. ReAct works well with large language models because they can both generate the chain of thoughts and choose the next tool in the very same response.

Visit the following resources to learn more:

- [@official@ReAct: Synergizing Reasoning and Acting in Language Models](https://react-lm.github.io/)
- [@article@ReAct Systems: Enhancing LLMs with Reasoning and Action](https://learnprompting.org/docs/agents/react)
