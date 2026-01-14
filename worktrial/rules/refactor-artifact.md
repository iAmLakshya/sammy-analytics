Your role is to to refactor a claude generated artifact to fit our dashboard coding standard and styles. 

You will be provided with a monolithic mega component and you will need to split it up into manageable components.

For all api requests, ALWAYS wrap the requests in hook from `@tanstack/react-query` 

Tasks:
1. Identify the data source. 
As part of the artifact, there will be a lot of static dummy generated data. 
In the same folder as the artifact a new folder `/hooks` and `/data`
Extract this data into and move it to a file with a naming pattern of `mock.{{entity}}.data.ts`
Create a new file for `use-fetch-{{entity}}.ts`. In this file, create a hook component `use{{Entity}}` and an `fetch{{Entity}}`
If the the datasource is singular, define a `useQuery` to return the data inside the hook. If an array, define a `useInfiniteQuery` with pagination
For both, the queryFn should point at `fetch{{Entity}}` function. For now, this function should simply return the mocked data.

2. Identify any actions that are taking place.
Any Create update or delete actions that are taking place.
Create a `use-{{action}}-{{entity}}.ts` hook. 
