package opensdk.sdk.apis.klay.block;

import opensdk.sdk.apis.BaseOpenSDK;
import opensdk.sdk.models.BlockNumber200Response;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.IOException;

@DisplayName("Klay RPC Test")
public class KlayBlockNumberApiTest extends BaseOpenSDK {

    @Test
    @DisplayName("RPC klay_blockNumber")
    void whenRequestValid_ThenCall200ResponseReturns() throws IOException {
        BlockNumber200Response br = sdk.klay.blockNumber().send();
        br.getResult();
    }
}
