export class StringExtensions {
  static isNullOrWhitespace(input: string): boolean {
    return !input || !input.trim();
  }

}
