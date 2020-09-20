function update_cargo_toml_version {
    VERSION=$1
    FILE=$2

    sed -i "0,/^version/s/^version *= *\".*\"/version = \"$VERSION\"/" $FILE
    toml set $2 package.version $1 > out && mv out $2
}

update_cargo_toml_version $1 nnsplit/Cargo.toml
update_cargo_toml_version $1 bindings/python/Cargo.toml
update_cargo_toml_version $1-python0 bindings/python/Cargo.build.toml
npm version $1 --prefix bindings/javascript --allow-same-version
