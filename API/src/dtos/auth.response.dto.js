class AuthResponseDto {
    constructor(data) {
        const { token, admin } = data.user;
        
        this.token = token;
        this.admin = {
            id: admin.id,
            name: admin.name,
            email: admin.email
        };
    }
}

module.exports = {AuthResponseDto};