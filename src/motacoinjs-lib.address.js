//https://raw.github.com/motacoinjs/motacoinjs-lib/09e8c6e184d6501a0c2c59d73ca64db5c0d3eb95/src/address.js
MotaCoin.Address = function (bytes) {
	if ("string" == typeof bytes) {
		bytes = MotaCoin.Address.decodeString(bytes);
	}
	this.hash = bytes;
	this.version = MotaCoin.Address.networkVersion;
};

MotaCoin.Address.networkVersion = 0x32; // mainnet

/**
* Serialize this object as a standard MotaCoin address.
*
* Returns the address as a base58-encoded string in the standardized format.
*/
MotaCoin.Address.prototype.toString = function () {
	// Get a copy of the hash
	var hash = this.hash.slice(0);

	// Version
	hash.unshift(this.version);
	var checksum = Crypto.SHA256(Crypto.SHA256(hash, { asBytes: true }), { asBytes: true });
	var bytes = hash.concat(checksum.slice(0, 4));
	return MotaCoin.Base58.encode(bytes);
};

MotaCoin.Address.prototype.getHashBase64 = function () {
	return Crypto.util.bytesToBase64(this.hash);
};

/**
* Parse a MotaCoin address contained in a string.
*/
MotaCoin.Address.decodeString = function (string) {
	var bytes = MotaCoin.Base58.decode(string);
	var hash = bytes.slice(0, 21);
	var checksum = Crypto.SHA256(Crypto.SHA256(hash, { asBytes: true }), { asBytes: true });

	if (checksum[0] != bytes[21] ||
			checksum[1] != bytes[22] ||
			checksum[2] != bytes[23] ||
			checksum[3] != bytes[24]) {
		throw "Checksum validation failed!";
	}

	var version = hash.shift();

	if (version != 0) {
		throw "Version " + version + " not supported!";
	}

	return hash;
};
