class Block {
  constructor(
    public index: number,
    public previousHash: string,
    public timestamp: number,
    public data: string,
    public hash: string,
    public nonce: number
  ) {}

  static get genesis() {
    return new Block(
      0,
      "0",
      1508270000000,
      "Welcome to Blockchain Demo 2.0!",
      "000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a9920261d8109b37cf",
      604
    );
  }
}

export default Block;
