pragma solidity ^0.4.17;

import "./ConvertLib.sol";

contract DALog {
    struct Blog {
        uint blogId;
        address writer;
        string title;
        string body;
    }

    Blog[] public blogs;

    function sendBlog(uint _blogId, string _title, string _body) public returns(bool) {
        blogs.push(Blog({
            blogId: _blogId,
            writer: msg.sender,
            title: _title,
            body: _body
        }));
		return true;
    }

    function getBlogsCount() public constant returns(uint) {
        return blogs.length;
    }

    function getBlog(uint index) public constant returns(uint, address, string, string) {
        return (blogs[index].blogId, blogs[index].writer, blogs[index].title, blogs[index].body);
    }
}
