import * as Table from "cli-table3";
import {Action} from "./action";

/**
 * Action which prints info about the entire CLI tool.
 */
export class InfoAction extends Action {

  override execute(args: string[]) {
    const table = new Table({
      chars: {
        'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
        'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' ,
        'bottom-right': '', 'left': '' , 'left-mid': '' , 'mid': '' ,
        'mid-mid': '', 'right': '' , 'right-mid': '' , 'middle': ' '
      },
    });
    const tableData = this.commandsToTableData();
    for (const row of tableData) {
      table.push(row);
    }

    const renderedTable = table.toString();
    const renderedSyntax = this.renderCLISyntax();
    
    console.log(
        `${renderedSyntax}\n\n` +
        (!!this.flags.description ? `${this.flags.description}\n\n` : "") +
        `Available commands:\n\n` +
        `${renderedTable}\n`);
  }

  private renderCLISyntax() {
    const cliName = this.flags.name;
    return `${cliName} <command> [<args>...]`;
  }

  private commandsToTableData(): string[][] {
    const output: string[][] = [];
    for (const flag of this.flags.commands.values()) {
      output.push([
        flag.name,
        flag.description,
      ]);
    }
    return output;
  }

}
