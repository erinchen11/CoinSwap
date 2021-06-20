pragma solidity ^0.5.0;

contract Token {
    string public name = "Defi Token";
    string public symbol = "DEFI";
    uint256 public totalSupply = 1000000000000000000000000;
    uint8 public decimals = 18;

    // two event : Transfer, Approval
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    //直接交易的function，由傳送者呼叫function，執行過程會先檢查傳送者所持有的餘額是不是大於或等於傳送的金額，如果符合，將會確實扣除傳送者所持有的餘額，並增加接收者的餘額，最後會發布交易訊息Transfer event到transaction receipt，公布在blockchain上
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // 為轉帳程序第一步，紀錄雙方的轉帳行為，當傳送者准許轉帳給接收者，將會執行approve function ，並將雙方address 和轉帳額度，放到mapping allowed紀錄轉帳行為，最後發布轉帳允許訊息Approve event到transaction receipt，公布在blockchain上
    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }


}
