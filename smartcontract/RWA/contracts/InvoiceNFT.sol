
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


contract InvoiceNFT is ERC721, AccessControl {
    using Strings for uint256;

    bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");

    struct InvoiceData {
        uint256 faceValue;
        uint256 dueDate;     
        bytes32 debtorHash;
    }

    uint256 private _nextId;
    mapping(uint256 => InvoiceData) public invoices;

    event InvoiceMinted(uint256 indexed id, address indexed owner, uint256 faceValue, uint256 dueDate, bytes32 debtorHash);

    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_)  {
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mintInvoice(address to, uint256 faceValue, uint256 dueDate, bytes32 debtorHash) external onlyRole(CONTROLLER_ROLE) returns (uint256) {
        require(faceValue > 0, "faceValue>0");
        require(dueDate > block.timestamp, "dueDate>now");

        uint256 id = ++_nextId;
        _safeMint(to, id);
        invoices[id] = InvoiceData({faceValue: faceValue, dueDate: dueDate, debtorHash: debtorHash});
        emit InvoiceMinted(id, to, faceValue, dueDate, debtorHash);
        return id;
    }

    function getInvoice(uint256 id) external view returns (InvoiceData memory) {
        return invoices[id];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}