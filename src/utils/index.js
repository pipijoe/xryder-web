import logo from '../assets/logo.png'
import empty from '../assets/empty.png'
import file from '../assets/file.png'
import image from '../assets/image.png'
import agent from '../assets/agent.svg'

export const logoImg = logo
export const emptyImg = empty
export const fileImg = file
export const imageImg = image
export const agentImg = agent
import { JSEncrypt } from 'jsencrypt';

export const encryptPassword = (password, publicKey) => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    const encryptedPassword = encrypt.encrypt(password);
    return encryptedPassword;
};

// 递归函数查找路径
export const findDepartmentPathById = (node, targetId, path = []) => {
    if (node) {
        // 当前节点的 id 匹配，返回路径
        if (node.id === targetId) {
            return [...path, node.name];
        }

        // 遍历 children，查找匹配的节点
        if (node.children && node.children.length > 0) {
            for (let child of node.children) {
                const result = findDepartmentPathById(child, targetId, [...path, node.name]);
                if (result) {
                    return result;
                }
            }
        }
    }

    return null;
};

// 处理路径显示（超过 4 层用 ... 表示）
export const formatPath = (path) => {
    if (path) {
        if (path.length >= 4) {
            // 如果层级大于等于 4 层，保留第一层、倒数第二层和最后一层
            return `${path[0]} / ... / ${path[path.length - 2]} / ${path[path.length - 1]}`;
        } else {
            // 如果层级小于 4 层，直接返回原路径
            return path.join(' / ');
        }
    }
};

// 查询部门父id数组，输出示例: [1, 4, 25]
export const findParentIds = (node, targetId, path = []) => {
    if (node.id === targetId) {
        return path; // 找到目标ID，返回路径
    }

    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            const result = findParentIds(child, targetId, [...path, node.id]);
            if (result) {
                return result; // 如果找到结果，返回
            }
        }
    }

    return null; // 未找到，返回null
}

// 生成随机字符串的函数
export const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
};

// 拼接请求查询语句
export const parseQuery = (obj) => {
    let str = '';
    for (let key in obj) {
        const value =
            typeof obj[key] !== 'string' ? JSON.stringify(obj[key]) : obj[key];
        str += '&' + key + '=' + value;
    }
    return str.slice(1);
}
