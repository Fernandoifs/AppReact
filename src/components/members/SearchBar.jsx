import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'

const SearchBar = ({ onSearch }) => {
  return (
    <InputGroup maxW="600px" mb={4}>
      <InputLeftElement pointerEvents="none">
        <FaSearch color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="Buscar membros..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </InputGroup>
  )
}

export default SearchBar