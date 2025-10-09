# OpenAI Functions Calling

OpenAI Function Calling lets you give a language model a list of tools and have it decide which one to use and with what data. You describe each tool with a short name, what it does, and the shape of its inputs in a small JSON-like schema. You then pass the user message and this tool list to the model. Instead of normal text, the model can reply with a JSON block that names the tool and fills in the needed arguments. Your program reads this block, runs the real function, and can send the result back for the next step. This pattern makes agent actions clear, easy to parse, and hard to abuse, because the model cannot run code on its own and all calls go through your checks. It also cuts down on prompt hacks and wrong formats, so agents work faster and more safely.

Visit the following resources to learn more:

- [@official@OpenAI Documentation – Function Calling](https://platform.openai.com/docs/guides/function-calling)  
- [@official@OpenAI Cookbook – Using Functions with GPT Models](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_call_functions_with_chat_models.ipynb)  
- [@officialOpenAI Blog – Announcing Function Calling and Other Updates](https://openai.com/blog/function-calling-and-other-api-updates)  
- [@officialOpenAI API Reference – Functions Section](https://platform.openai.com/docs/api-reference/chat/create#functions)  
- [@officialOpenAI Community – Discussions and Examples on Function Calling](https://community.openai.com/tag/function-calling)  
