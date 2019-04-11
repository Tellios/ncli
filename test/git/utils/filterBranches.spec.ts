import { filterBranches, IBranch } from '../../../src/git/utils';

describe('filterBranches', () => {
    let mockBranches: IBranch[];

    beforeEach(() => {
        mockBranches = [
            {
                isCurrent: true,
                isRemote: false,
                name: 'develop'
            },
            {
                isCurrent: false,
                isRemote: false,
                name: 'master'
            },
            {
                isCurrent: false,
                isRemote: true,
                name: 'remotes/origin/develop'
            },
            {
                isCurrent: false,
                isRemote: true,
                name: 'remotes/origin/feature/test'
            },
            {
                isCurrent: false,
                isRemote: true,
                name: 'remotes/origin/release/1.9'
            },
            {
                isCurrent: false,
                isRemote: false,
                name: 'feature/test'
            }
        ];
    });

    it('should accept empty/null/undefined filter', () => {
        expect(filterBranches(mockBranches).length).toEqual(
            mockBranches.length
        );
        expect(filterBranches(mockBranches, null).length).toEqual(
            mockBranches.length
        );
        expect(filterBranches(mockBranches, '').length).toEqual(
            mockBranches.length
        );
        expect(filterBranches(mockBranches, ' ').length).toEqual(
            mockBranches.length
        );
    });

    it('should only return branches that includes develop', () => {
        const result = filterBranches(mockBranches, 'develop');

        expect(result.length).toEqual(2);
        expect(result[0].name).toEqual('develop');
        expect(result[1].name).toEqual('remotes/origin/develop');
    });

    it('should only return branches that includes feature', () => {
        const result = filterBranches(mockBranches, 'feature');

        expect(result.length).toEqual(2);
        expect(result[0].name).toEqual('remotes/origin/feature/test');
        expect(result[1].name).toEqual('feature/test');
    });

    it('should only return branches that includes feature/test', () => {
        const result = filterBranches(mockBranches, 'feature/test');

        expect(result.length).toEqual(2);
        expect(result[0].name).toEqual('remotes/origin/feature/test');
        expect(result[1].name).toEqual('feature/test');
    });

    it('should only return branches that includes 1.9', () => {
        const result = filterBranches(mockBranches, '1.9');

        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual('remotes/origin/release/1.9');
    });
});
