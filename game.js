//
// RSG Chess
// Licensed under Apache 2.0 LICENSE

var PIECE_CHARS = {
    pawn: { W: '♙', B: '♟' },
    rook: { W: '♖', B: '♜' },
    knight: { W: '♘', B: '♞' },
    bishop: { W: '♗', B: '♝' },
    queen: { W: '♕', B: '♛' },
    king: { W: '♔', B: '♚' }
  }
  
  function Piece (x, y, charBase, color, game, type) {
    if (charBase) this.char = charBase[color]
    this.color = color
    this.x = x
    this.y = y
    this.game = game
    this.type = type
    if (type) {
      var FENname = type === 'knight' ? 'n' : type.charAt(0)
      if (this.color === 'W') FENname = FENname.toUpperCase()
      this.FENname = FENname
    }
  }
  
  Piece.empty = function () {
    return new Piece()
  }
  
  Piece.prototype.getValidMoves = function () {
    return [
      {x: 0, y: 0},
      {x: 7, y: 7}
    ]
  }
  
  function Pawn (x, y, color, game) {
    Piece.call(this, x, y, PIECE_CHARS.pawn, color, game, 'pawn')
  }
  
  Pawn.prototype = Piece.empty()
  Pawn.prototype.getValidMoves = function (simulate) {
    var game = this.game
    var moves = []
    /* eslint-disable */
    var y = this.y, x = this.x
    var board = game.board, turn = game.turn, length = turn.length
    var last, turnTo, turnFrom, figX, passantLast, passantFig
    var colorY = this.color === 'W' ? y - 1 : y + 1  
    var colorY2 = this.color === 'W' ? y - 2 : y + 2  
    var passantY2 = this.color === 'W' ? 3 : 4  
    var figXArray = [x - 1, x + 1]
    /* eslint-enable */
  
    if (colorY < 8 && colorY >= 0 && !board[colorY][x]) {
      moves.push({x: x, y: colorY})
      if ((y === 1 || y === 6) && colorY2 < 8 && colorY2 >= 0 && !game.board[colorY2][x]) {
        moves.push({x: x, y: colorY2})
      }
    }
  
    for (var i = 0; i < 2; i++) {
      figX = figXArray[i]
      if (colorY < 8 && colorY >= 0 && board[colorY][figX] &&
      board[colorY][figX].color !== this.color) moves.push({x: figX, y: colorY})
    }
  
    // Check for en-passant
    for (var i = 0; i < 2; i++) {
      figX = figXArray[i]
      last = turn[length - 1]
  
      if (
        last && last.type === 'pawn' && last.to.x === figX && last.to.y === y &&
        last.color !== this.color && (last.from.y === 1 || last.from.y === 6) && (y === 3 || y === 4)
      ) {
        moves.push({
          x: figX,
          y: colorY,
          movePiece: {
            piece: game.board[y][figX],
            from: {
              x: figX,
              y: y
            },
            to: null
          }
        })
      }
    }
  
    var validMoves = []
    if (simulate) {
      validMoves = game.simulateAndFilter(moves, this)
    } else {
      validMoves = moves
    }
  
    return validMoves
  }
  
  Piece.pawn = function (x, y, color, game) {
    return new Pawn(x, y, color, game)
  }
  
  // //
  
  function Rook (x, y, color, game) {
    Piece.call(this, x, y, PIECE_CHARS.rook, color, game, 'rook')
  }
  
  Rook.prototype = Piece.empty()
  Rook.prototype.getValidMoves = function (simulate) {
    var game = this.game
    var moves = [];
  
    [[-1, 0], [1, 0], [0, 1], [0, -1]].forEach(function (coef) {
      var index, x, y, piece
      for (index = 1; ; index++) {
        x = this.x + coef[0] * index
        y = this.y + coef[1] * index
        if (y < 0 || y > 7 || x < 0 || x > 7) break
  
        piece = game.board[y][x]
        if (piece && piece.color === this.color) break
  
        moves.push({x: x, y: y})
        if (piece) break
      }
    }, this)
  
    var validMoves = []
    if (simulate) {
      validMoves = game.simulateAndFilter(moves, this)
    } else {
      validMoves = moves
    }
  
    return validMoves
  }
  
  Piece.rook = function (x, y, color, game) {
    return new Rook(x, y, color, game)
  }
  
  // //
  
  function Knight (x, y, color, game) {
    Piece.call(this, x, y, PIECE_CHARS.knight, color, game, 'knight')
  }
  
  Knight.prototype = Piece.empty()
  Knight.prototype.getValidMoves = function (simulate) {
    var game = this.game
    var moves = []
  
    var coordinates = [ [2, 1], [-2, 1], [1, 2], [-1, 2], [2, -1], [-2, -1], [1, -2], [-1, -2] ]
  
    var one, two
    for (var i = 0; i < coordinates.length; i++) {
      var help = false
      var boardPiece
      one = coordinates[i][0]
      two = coordinates[i][1]
  
      if (this.x + one < 8 && this.x + one >= 0 && this.y + two < 8 && this.y + two >= 0) {
        boardPiece = game.board[this.y + two][this.x + one]
        help = boardPiece ? boardPiece.color !== this.color : true
      }
  
      if (help) {
        moves.push({x: this.x + one, y: this.y + two})
      }
    }
  
    var validMoves = []
    if (simulate) {
      validMoves = game.simulateAndFilter(moves, this)
    } else {
      validMoves = moves
    }
  
    return validMoves
  }
  
  Piece.knight = function (x, y, color, game) {
    return new Knight(x, y, color, game)
  }
  
  // //
  
  function Bishop (x, y, color, game) {
    Piece.call(this, x, y, PIECE_CHARS.bishop, color, game, 'bishop')
  }
  
  Bishop.prototype = Piece.empty()
  Bishop.prototype.getValidMoves = function (simulate) {
    var game = this.game
    var moves = [];
  
    [[-1, -1], [1, 1], [-1, 1], [1, -1]].forEach(function (coef) {
      var index, x, y, piece
      for (index = 1; ; index++) {
        x = this.x + coef[0] * index
        y = this.y + coef[1] * index
        if (y < 0 || y > 7 || x < 0 || x > 7) break
  
        piece = game.board[y][x]
        if (piece && piece.color === this.color) break
  
        moves.push({x: x, y: y})
        if (piece) break
      }
    }, this)
  
    var validMoves = []
    if (simulate) {
      validMoves = game.simulateAndFilter(moves, this)
    } else {
      validMoves = moves
    }
  
    return validMoves
  }
  
  Piece.bishop = function (x, y, color, game) {
    return new Bishop(x, y, color, game)
  }
  
  // //
  
  function Queen (x, y, color, game) {
    Piece.call(this, x, y, PIECE_CHARS.queen, color, game, 'queen')
  }
  
  Queen.prototype = Piece.empty()
  Queen.prototype.getValidMoves = function (simulate) {
    var game = this.game
    var rookMoves = Rook.prototype.getValidMoves.call(this)
    var bishopMoves = Bishop.prototype.getValidMoves.call(this)
    var moves = rookMoves.concat(bishopMoves)
  
    var validMoves = []
    if (simulate) {
      validMoves = game.simulateAndFilter(moves, this)
    } else {
      validMoves = moves
    }
  
    return validMoves
  }
  
  Piece.queen = function (x, y, color, game) {
    return new Queen(x, y, color, game)
  }
  
  // //
  
  function King (x, y, color, game) {
    Piece.call(this, x, y, PIECE_CHARS.king, color, game, 'king')
  }
  
  King.prototype = Piece.empty()
  King.prototype.getValidMoves = function (simulate) {
    var moves = []
    var coordinates = [ [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1], [-1, 0], [1, 0] ]
    var x = this.x
    var y = this.y
    var game = this.game
    var turn = game.turn
    var self = this
  
    coordinates.forEach(function (coord) {
      var piece
      var xx = x + coord[0]
      var yy = y + coord[1]
  
      if (xx < 8 && xx >= 0 && yy < 8 && yy >= 0) {
        piece = game.board[yy][xx]
        if (!piece || piece.color !== self.color) {
          moves.push({x: xx, y: yy})
        }
      }
    })
  
    // Check king hasn't moved
    var kingMoved = turn.some(function (turn) {
      return turn.type === 'king' && turn.color === self.color
    })
  
    if (!kingMoved) {
      [[0, 2, -1], [7, 6, +1]].forEach(function (props) {
        var rookX = props[0]
        var newKingX = props[1]
        var dir = props[2]
        var rook = game.board[y][rookX]
  
        // Check rook on position
        if (!rook || !rook.type === 'rook') return
  
        // Check rook hasn't moved
        if (turn.some(function (ev) {
          return ev.from.x === rookX && ev.from.y === y
        })) return
  
        // Check squares empty and safe
        for (var xx = x + dir; xx !== rookX; xx += dir) {
          if (game.board[y][xx]) return
          var safe = true
          game.board.forEach(function (ev) {
            ev.forEach(function (evv) {
              if (evv && evv.type !== 'king' && evv.color !== self.color) {
                evv.getValidMoves().forEach(function (evMove) {
                  if (evMove && evMove.y === y && evMove.x === xx) safe = false
                })
              }
            })
          })
          if (!safe) return
        }
  
        var rochade = {
          x: newKingX,
          y: y,
          movePiece: {
            piece: self.game.board[y][rookX],
            from: {
              x: rookX, y: y
            },
            to: {
              y: y, x: x + dir
            }
          }
        }
  
        moves.push(rochade)
      })
    }
  
    var validMoves = []
    if (simulate) {
      validMoves = game.simulateAndFilter(moves, self)
    } else {
      validMoves = moves
    }
  
    return validMoves
  }
  
  Piece.king = function (x, y, color, game) {
    return new King(x, y, color, game)
  }
  
  function Game (promoCallback) {
    // the game board
    this.board = []
    // fill the board
    for (var i = 0; i < 8; i++) {
      var arrayIn = []
      for (var j = 0; j < 8; j++) {
        arrayIn.push(null)
      }
      this.board.push(arrayIn)
    }
  
    // the history of all turns
    this.turn = []
    // the current FEN status
    this.FEN = []
    // the current game configuration as FEN
    this.FENboard = []
    // the history of all game configurations displayed using FEN
    this.threefold = []
  }
  
  Game.prototype.piece = function (type, x, y, color) {
    var piece = Piece[type](x, y, color, this)
    this.board[y][x] = piece
  
    this.FEN = this.gameToFEN()
    this.FENboard = this.boardToFEN()
  }
  
  Game.prototype.moveSelected = function (
    selected, to, promotionCallback, checkmateCallback, playAgainstAI, comingAI, simulate
  ) {
    var x = to.x
    var y = to.y
  
    if (selected) {
      var from = { x: selected.x, y: selected.y }
  
      if (this.board[y][x] !== selected) {
        var validMoves = selected.getValidMoves(!simulate)
        var validMove = null
  
        for (var i = 0; i < validMoves.length; i++) {
          var vm = validMoves[i]
          if (vm.x === x && vm.y === y) {
            validMove = vm
            break
          }
        }
  
        if (!validMove) return false
        var movePiece = validMove.movePiece
        var take, paste, rook
        if (movePiece) {
          take = movePiece.from
          paste = movePiece.to
          if (paste === null) {
            this.board[take.y][take.x] = null
          } else {
            rook = this.board[take.y][take.x]
            this.board[paste.y][paste.x] = rook
            rook.x = paste.x
            rook.y = paste.y
            this.board[take.y][take.x] = null
          }
        }
  
        var piece = this.board[y][x] ? this.board[y][x] : null
        movePiece = (movePiece ? validMove.movePiece : null)
        this.turn.push({
          from: from,
          to: to,
          color: selected.color,
          type: selected.type,
          piece: piece,
          movePiece: movePiece
        })
  
        this.board[y][x] = selected
        this.board[selected.y][selected.x] = null
        this.board[y][x].x = x
        this.board[y][x].y = y
  
        this.FEN = this.gameToFEN()
        this.FENboard = this.boardToFEN()
        // check for threefold repetition
  
        this.threefold.push(this.FENboard)
        if (selected.type === 'pawn' || piece) this.threefold = []
        if (this.threefoldCheck()) checkmateCallback('D')
  
        // check for the fifty-move rule
        if (this.halfmoveClock() >= 50) checkmateCallback('D')
  
        // check for pawn promotion
        if (selected.type === 'pawn') {
          if ((selected.color === 'W' && y === 0) || (selected.color === 'B' && y === 7)) {
            if (promotionCallback) {
              !playAgainstAI && comingAI && selected.color === 'B'
                ? this.promotePawn(selected, x, y, selected.color, 'queen')
                : promotionCallback(selected, x, y, selected.color)
            }
          }
        };
  
        var checkmateColor = selected.color === 'W' ? 'B' : 'W'
        var checkmateValue = this.checkmate(checkmateColor)
        if (checkmateValue) checkmateCallback(checkmateValue)
  
        // Play AI
        if (playAgainstAI) {
          var bestMove = ChessAI(playAgainstAI.depth, this, false)
          this.moveSelected(
            this.board[bestMove.from.y][bestMove.from.x],
            bestMove.to,
            promotionCallback,
            checkmateCallback,
            false,
            true,
            simulate
          )
        }
        // end
      }
      selected = null
      return true
    }
  }
  
  Game.prototype.promotePawn = function (pawn, x, y, color, type) {
    this.piece(type, x, y, color)
  }
  
  Game.prototype.simulateAndFilter = function (moves, piece) {
    var validMoves = []
    var self = this
    var board = this.board
  
    moves.forEach(function (move, i) {
      var y = move.y
      var x = move.x
      var from = { x: piece.x, y: piece.y }
      var movePiece = board[y][x] ? {
        piece: board[y][x],
        from: { x: x, y: y },
        to: null
      } : null
  
      if (move.movePiece) movePiece = move.movePiece
      if (movePiece) self.simpleMovePiece(movePiece.piece, movePiece.from, movePiece.to)
  
      self.simpleMovePiece(piece, from, { x: x, y: y })
      var warning = self.warning(piece.color)
  
      // Return king
      self.simpleMovePiece(piece, { x: x, y: y }, from)
  
      // return the movePiece with simpleMovePiece() method
      if (movePiece) self.simpleMovePiece(movePiece.piece, movePiece.to, movePiece.from)
  
      if (!warning) validMoves.push(move)
    })
    return validMoves
  }
  
  Game.prototype.checkmate = function (color) {
    // using var will allow us to make the code a bit simpler
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (
          this.board[i][j] &&
          this.board[i][j].color === color &&
          this.board[i][j].getValidMoves(true).length
        ) return false
      }
    }
    if (this.warning(color)) return color
    return 'D'
  }
  
  Game.prototype.simpleMovePiece = function (piece, from, to) {
    var board = this.board
    if (to) {
      board[to.y][to.x] = piece
      piece.x = to.x
      piece.y = to.y
    }
    if (from) board[from.y][from.x] = null
  }
  
  Game.prototype.simpleMove = function (move) {
    var self = this
    var board = self.board
    var from = move.from
    var to = move.to
    var piece = board[from.y][from.x]
    var capturedPiece = this.board[to.y][to.x] ? this.board[to.y][to.x] : null
    var movePiece = board[to.y][to.x] ? {
      piece: board[to.y][to.x],
      from: { x: to.x, y: to.y },
      to: null
    } : null
  
    this.turn.push({
      from: from,
      to: { x: to.x, y: to.y },
      color: move.color,
      type: piece.type,
      piece: capturedPiece,
      movePiece: movePiece
    })
  
    if (to.movePiece) movePiece = to.movePiece
    if (movePiece) self.simpleMovePiece(movePiece.piece, movePiece.from, movePiece.to)
    self.simpleMovePiece(piece, from, { x: to.x, y: to.y })
  
    return function () {
      // return the current move /ev/
      if (movePiece) self.simpleMovePiece(movePiece.piece, movePiece.to, movePiece.from)
      self.simpleMovePiece(piece, { x: to.x, y: to.y }, from)
      if (capturedPiece) board[to.y][to.x] = capturedPiece
      self.turn.pop()
    }
  }
  
  Game.prototype.warning = function (color) {
    var result = false
    var king
  
    this.board.forEach(function (yyy) {
      yyy.forEach(function (xxx) {
        if (xxx && xxx.color === color && xxx.type === 'king') {
          king = xxx
        }
      })
    })
  
    this.board.forEach(function (yyy) {
      yyy.forEach(function (xxx) {
        if (xxx && xxx.color !== color) {
          xxx.getValidMoves().forEach(function (mmm) {
            if (mmm.x === king.x && mmm.y === king.y) result = true
          })
        }
      })
    })
    return result
  }
  
  Game.prototype.threefoldCheck = function () {
    var threefold = this.threefold
    var length = threefold.length
  
    for (var i = 0; i < length; i++) {
      // using var will allow us to make the code simpler
      var count = 0
      for (var j = i + 1; j < length; j++) {
        if (threefold[i] === threefold[j]) count += 1
      }
      if (count >= 2) return true
    }
  
    return false
  }
  
  Game.prototype.pieceToAN = function (x, y) {
    var xChars = 'abcdefgh'
    return xChars.charAt(x) + (8 - y)
  }
  
  // Support FEN functions in the API
  Game.prototype.boardToFEN = function () {
    var board = this.board
  
    // Convert the board configuration into FEN
    var FENboard = ''
    var missingPieces = 0
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (board[i][j]) {
          if (missingPieces) FENboard += missingPieces
          missingPieces = 0
          FENboard += board[i][j].FENname
        } else {
          missingPieces++
        }
      }
      if (missingPieces) FENboard += missingPieces
      missingPieces = 0
      FENboard += i < 7 ? '/' : ''
    }
  
    return FENboard
  }
  
  Game.prototype.halfmoveClock = function () {
    var turn = this.turn
    var length = turn.length
    var count = 0
    if (turn.length === 0) return count
  
    var ev = turn[(length - 1) - count]
    while (count <= length - 1 && ev.type !== 'pawn' && !ev.piece) {
      count++
      ev = turn[(length - 1) - count]
    }
  
    return count
  }
  
  Game.prototype.activeColour = function () {
    var turn = this.turn
    var activeColor =
      turn.length &&
      turn[turn.length - 1].color === 'W' ? 'b' : 'w'
  
    return activeColor
  }
  
  Game.prototype.castlingTarget = function () {
    var board = this.board
    var turn = this.turn
    var possibleCastling = ''
  
    var whiteKingMoved
    var blackKingMoved
    turn.forEach(function (turn) {
      whiteKingMoved = turn.type === 'king' && turn.color === 'W'
      blackKingMoved = turn.type === 'king' && turn.color === 'B'
    });
  
    [[7, 0], [0, 0], [7, 7], [0, 7]].forEach(function (props) {
      var rookX = props[0]
      var rookY = props[1]
      var rook = board[rookY][rookX]
  
      if (rookY === 7 && whiteKingMoved) return
      if (rookY === 0 && blackKingMoved) return
  
      // Check rook on position
      if (!rook || !rook.type === 'rook') return
  
      // Check rook hasn't moved
      if (turn.some(function (ev) {
        if (ev.type !== 'rook') return false
        return ev.from.x === rookX && ev.from.y === rookY
      })) return
  
      var castlingSide = rookX === 0 ? 'q' : 'k'
      possibleCastling += rookY === 0 ? castlingSide.toUpperCase() : castlingSide
    })
  
    if (!possibleCastling) possibleCastling = '-'
    return possibleCastling
  }
  
  Game.prototype.enPassantTarget = function () {
    var turn = this.turn
    var enPassantTarget = ''
  
    if (turn.length) {
      var ev = turn[turn.length - 1]
      if (ev.color === 'W' && ev.to.y === 4) {
        enPassantTarget = this.pieceToAN(ev.to.x, ev.to.y + 1)
      }
  
      if (ev.color === 'B' && ev.to.y === 3) {
        enPassantTarget = this.pieceToAN(ev.to.x, ev.to.y - 1)
      }
    }
  
    if (!enPassantTarget) enPassantTarget = '-'
    return enPassantTarget
  }
  
  Game.prototype.fullmoveCount = function () {
    var count = 1
    this.turn.forEach(function (ev) {
      if (ev.color === 'B') count += 1
    })
  
    return count
  }
  
  Game.prototype.gameToFEN = function () {
    var FEN = ''
  
    // Check the board configuration
    FEN += this.boardToFEN()
  
    // Find the active colour
    FEN += ' ' + this.activeColour()
  
    // Check castling availability
    FEN += ' ' + this.castlingTarget()
  
    // Check the En-passant target
    FEN += ' ' + this.enPassantTarget()
  
    // Add the halfmove clock
    FEN += ' ' + this.halfmoveClock()
  
    // Add the fullmove number
    FEN += ' ' + this.fullmoveCount()
  
    /*
      More information about the FEN notation:
      https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
      https://chessprogramming.wikispaces.com/Forsyth-Edwards+Notation
    */
  
    return FEN
  }
  
  // Set up default game configuration
  Game.prototype.initializeGame = function () {
    var defaultGame = new Game()
  
    // Pawns:
    for (var i = 0; i < 8; i++) {
      defaultGame.piece('pawn', i, 6, 'W')
      defaultGame.piece('pawn', i, 1, 'B')
    }
  
    // Black figs:
    defaultGame.piece('rook', 0, 0, 'B')
    defaultGame.piece('knight', 1, 0, 'B')
    defaultGame.piece('bishop', 2, 0, 'B')
    defaultGame.piece('queen', 3, 0, 'B')
    defaultGame.piece('king', 4, 0, 'B')
    defaultGame.piece('bishop', 5, 0, 'B')
    defaultGame.piece('knight', 6, 0, 'B')
    defaultGame.piece('rook', 7, 0, 'B')
  
    // White figs:
    defaultGame.piece('rook', 0, 7, 'W')
    defaultGame.piece('knight', 1, 7, 'W')
    defaultGame.piece('bishop', 2, 7, 'W')
    defaultGame.piece('queen', 3, 7, 'W')
    defaultGame.piece('king', 4, 7, 'W')
    defaultGame.piece('bishop', 5, 7, 'W')
    defaultGame.piece('knight', 6, 7, 'W')
    defaultGame.piece('rook', 7, 7, 'W')
  
    return defaultGame
  }
  
  Game.prototype.allMoves = function () {
    var board = this.board
    var allMoves = []
    var activeColour = this.activeColour().toUpperCase()
  
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        if (board[i][j] && board[i][j].color === activeColour) {
          var validMoves = board[i][j].getValidMoves(true)
          validMoves.forEach(function (ev) {
            allMoves.push({
              color: board[i][j].color,
              from: {x: j, y: i},
              to: ev,
              FENname: board[i][j].FENname
            })
          })
        }
      }
    }
  
    return allMoves
  }
  
  var ChessAI = function (depth, game, isMaximisingPlayer) {
    var allMoves = game.allMoves()
    var bestValue = -9999
    var bestMove
  
    for (var i = 0; i < allMoves.length; i++) {
      var newGameMove = allMoves[i]
      var undo = game.simpleMove(newGameMove)
      var boradValue = minimax(depth - 1, game, -10000, 10000, !isMaximisingPlayer)
      undo()
      if (boradValue >= bestValue) {
        bestValue = boradValue
        bestMove = newGameMove
      }
    }
    return bestMove
  }
  
  var minimax = function (depth, game, alpha, beta, isMaximisingPlayer) {
    if (depth === 0) {
      return -evaluateBoard(game.board)
    }
  
    var allMoves = game.allMoves()
    if (isMaximisingPlayer) {
      var bestValue = -9999
      for (var i = 0; i < allMoves.length; i++) {
        var undo = game.simpleMove(allMoves[i])
        bestValue = Math.max(bestValue, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer))
        undo()
        alpha = Math.max(alpha, bestValue)
        if (beta <= alpha) {
          return bestValue
        }
      }
      return bestValue
    } else {
      var bestValue = 9999
      for (var i = 0; i < allMoves.length; i++) {
        var undo = game.simpleMove(allMoves[i])
        bestValue = Math.min(bestValue, minimax(depth - 1, game, alpha, beta, !isMaximisingPlayer))
        undo()
        beta = Math.min(beta, bestValue)
        if (beta <= alpha) {
          return bestValue
        }
      }
      return bestValue
    }
  }
  
  var evaluateBoard = function (board) {
    var totalEvaluation = 0
    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 8; j++) {
        // calculate the current evaluation
        totalEvaluation = totalEvaluation + getPieceValue(board[i][j])
      }
    }
    // return the total evaluation
    return totalEvaluation
  }
  
  var getPieceValue = function (piece) {
    if (piece === null) {
      return 0
    }
  
    // get value for every piece on the board
    var getAbsoluteValue = function (piece) {
      if (piece.type === 'pawn') {
        return 10
      } else if (piece.type === 'rook') {
        return 50
      } else if (piece.type === 'knight') {
        return 30
      } else if (piece.type === 'bishop') {
        return 30
      } else if (piece.type === 'queen') {
        return 90
      } else if (piece.type === 'king') {
        return 900
      }
    }
  
    // calculate the absolute value and return it
    var absoluteValue = getAbsoluteValue(piece, piece.color === 'W')
    return piece.color === 'W' ? absoluteValue : -absoluteValue
  }
  
  RSGChess = {
    Game: Game,
    AI: ChessAI,
    Pieces: {
      PIECE_CHARS: PIECE_CHARS,
      pawn: Piece.pawn,
      rook: Piece.rook,
      knight: Piece.knight,
      bishop: Piece.bishop,
      queen: Piece.queen,
      king: Piece.king
    }
  }
  
  // Written by Radi Cho
  // RSG Chess - by RSG Group