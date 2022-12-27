import * as Table from "cli-table3";
import {Action} from "./action";
import {StrictFlags} from "../strict_flags";

/**
 * Action which prints info about the entire CLI tool.
 */
export class InfoAction implements Action {

  execute(args: string[], flags: StrictFlags) {
    const table = new Table({
      chars: {
        'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
        'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' ,
        'bottom-right': '', 'left': '' , 'left-mid': '' , 'mid': '' ,
        'mid-mid': '', 'right': '' , 'right-mid': '' , 'middle': ' '
      },
    });
    const tableData = this.commandsToTableData(flags);
    for (const row of tableData) {
      table.push(row);
    }

    const renderedTable = table.toString();
    
    console.log(`\n${renderedTable}\n`);
  }

  private commandsToTableData(flags: StrictFlags): string[][] {
    const output: string[][] = [];
    for (const flag of flags.commands.values()) {
      output.push([
        flag.name,
        flag.description,
      ]);
    }
    return output;
  }

}
