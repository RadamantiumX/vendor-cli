// import { it, vi, describe, expect, beforeAll } from "vitest";
// // import { select } from "@inquirer/prompts";
// // import customConfirm from "#main-dev/lib/custom-inquirer";
// // import tableMultiple from '@bartheleway/inquirer-table-multiple'

// // import { mockReturn } from "../mock/mocking-values";
// import { screen } from '@inquirer/testing/vitest';

// import { tableConfig, selectChoices, confirmMessage } from "../../lib/choices";
// import inquirerQuiz from "../../lib/inquirer";
// // Mocking the @inquirer/prompts used methods
// vi.mock("@inquirer/prompts", () => ({
//   tableMultiple: vi.fn(),
//   select: vi.fn(),
//   customConfirm: vi.fn(),
// }));

// // See this example: https://github.com/SBoudrias/Inquirer.js/tree/main/packages/testing

// beforeAll(async ()=>{
//     tableConfig.columns.unshift({
//       title: "Api",
//       value: "api"
//     },
//     {
//       title: "Client",
//       value: "client"
//     }
//   )

//   tableConfig.rows.push({
//       title: "REACT",
//       value: "react"
//   },
//   {
//     title: "NODE",
//     value: "node"
//   }
// )
// })

// const tableAnswers = [{
//   choice: {
//     value: "react",
//     title: "REACT"
//   },
//   answers: ["api"]
// }]

// describe("inquirerQuiz", () => {

//   it("should process correctly the user prompt", async () => {
//     // Mocked the currents values
//     //  ‼️Use the select value "Once" to avoid duplicates

//     // Resolve with this: https://github.com/Bartheleway/inquirer-table-multiple/blob/master/test/normal.test.mts

//     vi.mocked(tableMultiple).mockResolvedValueOnce(tableAnswers)
//     vi.mocked(select).mockResolvedValueOnce("npm")
//     vi.mocked(customConfirm).mockResolvedValue(true)
//     // To evaluate
//     const result = await inquirerQuiz();

//     // Expected with each used methods
//     expect(tableMultiple).toHaveBeenCalledWith(
//       expect.objectContaining(tableConfig),
//     );
//     expect(select).toHaveBeenCalledWith(
//       expect.objectContaining(selectChoices),
//     );

//     expect(customConfirm).toHaveBeenCalledWith(
//       expect.objectContaining(confirmMessage));

//     expect(result).toStrictEqual(mockReturn);
//   });
// });

// TODO: maybe this works: https://github.com/SBoudrias/Inquirer.js/tree/main/packages/testing
// TODO: see this: https://github.com/Bartheleway/inquirer-table-multiple/blob/master/test/multiple.test.mts
// describe("inquirerQuiz", ()=>{
// it("should render properly", async () => {

//  const result = inquirerQuiz();
//  expect(screen.getScreen()).toMatchInlineSnapshot([
// '"? Select the workspace (Press <space> to select, <Up and Down> to move rows, <Left and Right> to move columns)',
// '',
// '┌──────────┬─────────┬─────────┬─────────┬────────────────┐',
// '│ 1-2 of 2 │ Api     │ Client  │ Root    │ Dev-Dependency │',
// '├──────────┼─────────┼─────────┼─────────┼────────────────┤',
// '│ REACT    │ [ [ ] ] │   [ ]   │   [ ]   │   [ ]          │',
// '├──────────┼─────────┼─────────┼─────────┼────────────────┤',
// '│ NODE     │   [ ]   │   [ ]   │   [ ]   │   [ ]          │',
// '└──────────┴─────────┴─────────┴─────────┴────────────────┘"',
// ].join('\n'))

//   screen.keypress('space')

//   await screen.next()
//   expect(screen.getScreen()).toContain('Select your package manager: ')
//   screen.keypress('return')

//   await screen.next()
//   expect(screen.getScreen()).toContain('¿Want continue with the process?')
//   screen.keypress('return')

//   await result
//    })
// })
